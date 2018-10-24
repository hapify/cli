import { Service } from 'typedi';
import { IField, IGeneratorResult, Access } from '../../interface';
import { Template, Model, Channel, FieldType } from '../../class';
import { JavaScriptGeneratorService, HpfGeneratorService, StringService } from '../';
import { SentenceFormat, TemplateEngine } from '../../enum';

/** Define the restriction for an action */
interface IActionAccesses { [s: string]: boolean|string; }

@Service()
export class GeneratorService {

  /**
   * Constructor
   *
   * @param stringService
   * @param hpfGeneratorService
   * @param javaScriptGeneratorService
   */
  constructor(private stringService: StringService,
              private hpfGeneratorService: HpfGeneratorService,
              private javaScriptGeneratorService: JavaScriptGeneratorService) {
  }

  /**
   * Compile for a whole channel
   * @param {Channel} channel
   * @returns {Promise<IGeneratorResult[]>}
   */
  async runChannel(channel: Channel): Promise<IGeneratorResult[]> {
    // Create results stack
    let output: IGeneratorResult[] = [];
    // For each template, run sub process
    for (const template of channel.templates) {
      const results = await this.runTemplate(template);
      output = output.concat(results);
    }
    return output;
  }

  /**
   * Compile a template to multiple files.
   * One per model, if applicable.
   *
   * @param {Template} template
   * @returns {Promise<IGeneratorResult[]>}
   */
  async runTemplate(template: Template): Promise<IGeneratorResult[]> {
    // For each template, build each models
    if (template.needsModel()) {
      // Create results stack
      const output: IGeneratorResult[] = [];
      const models = await template.channel().modelsCollection.list();
      for (const model of models) {
        output.push(await this._one(template, model));
      }
      return output;
    } else {
      return [await this._all(template)];
    }
  }

  /**
   * Run generation process for one model
   *
   * @param {Template} template
   * @param {Model|null} model
   * @returns {Promise<IGeneratorResult>}
   * @throws {Error}
   *  If the template needs a model and no model is passed
   */
  async run(template: Template, model: Model | null): Promise<IGeneratorResult> {
    if (template.needsModel()) {
      if (!model) {
        throw new Error('Model should be defined for this template');
      }
      return await this._one(template, model);
    } else {
      return await this._all(template);
    }
  }

  /**
   * Only process the path
   *
   * @param {Template} template
   * @param {Model} model
   * @returns {string}
   * @throws {Error}
   *  If the template needs a model and no model is passed
   */
  path(template: Template, model?: Model): string {
    if (template.needsModel()) {
      if (!model) {
        throw new Error('Model should be defined for this template');
      }
      return this._path(template.path, model);
    } else {
      return this._path(template.path);
    }
  }
  /**
   * Compute path from a string
   *
   * @param {string} path
   * @param {Model|null} model
   *  Default null
   * @returns {string}
   */
  pathPreview(path: string, model: Model|null = null): string {
    return this._path(path, model);
  }

  /**
   * Returns the input(s) that will be injected in a template
   *
   * @param {Channel} caller
   * @param {Model|null} model
   * @returns {Promise<any|any[]>}
   */
  inputs(caller: Channel, model: Model|null = null): Promise<any | any[]> {
    if (model) {
      return this._explicitModel(caller, model);
    } else {
      return this._explicitAllModels(caller);
    }
  }

  /**
   * Run generation process for one model
   *
   * @param {Template} template
   * @param {Model} model
   * @returns {Promise<IGeneratorResult>}
   * @throws {Error}
   *  If the template rendering engine is unknown
   * @private
   */
  private async _one(template: Template, model: Model): Promise<IGeneratorResult> {

    // Compute path
    const path = this._path(template.path, model);
    // Get full model description
    const input = await this._explicitModel(template.channel(), model);

    // Compute content
    let content;
    if (template.engine === TemplateEngine.Hpf) {
      content = await this.hpfGeneratorService.one(input, template);
    } else if (template.engine === TemplateEngine.JavaScript) {
      content = await this.javaScriptGeneratorService.one(input, template);
    } else {
      throw new Error('Unknown engine');
    }

    return {
      content,
      path
    };
  }

  /**
   * Run generation process for all models
   *
   * @param {Template} template
   * @returns {Promise<IGeneratorResult>}
   * @throws {Error}
   *  If the template rendering engine is unknowns
   * @private
   */
  private async _all(template: Template): Promise<IGeneratorResult> {

    // Compute path
    const path = this._path(template.path);
    // Get full models description
    const input = await this._explicitAllModels(template.channel());

    // Compute content
    let content;
    if (template.engine === TemplateEngine.Hpf) {
      content = await this.hpfGeneratorService.all(input, template);
    } else if (template.engine === TemplateEngine.JavaScript) {
      content = await this.javaScriptGeneratorService.all(input, template);
    } else {
      throw new Error('Unknown engine');
    }

    return {
      content,
      path
    };
  }

  /**
   * Compute path from a string
   *
   * @param {string} path
   * @param {Model|null} model
   *  Default null
   * @returns {string}
   * @private
   */
  private _path(path: string, model: Model|null = null): string {

    // Quick exit
    if (model === null) {
      return path;
    }

    // Apply replacements
    path = path.replace(/{model\.hyphen}/g, this.stringService.format(model.name, SentenceFormat.SlugHyphen));
    path = path.replace(/{model\.hyphenUpper}/g, this.stringService.format(model.name, SentenceFormat.SlugHyphenUpperCase));
    path = path.replace(/{model\.underscore}/g, this.stringService.format(model.name, SentenceFormat.SlugUnderscore));
    path = path.replace(/{model\.underscoreUpper}/g, this.stringService.format(model.name, SentenceFormat.SlugUnderscoreUpperCase));
    path = path.replace(/{model\.oneWord}/g, this.stringService.format(model.name, SentenceFormat.SlugOneWord));
    path = path.replace(/{model\.upperCamel}/g, this.stringService.format(model.name, SentenceFormat.UpperCamelCase));
    path = path.replace(/{model\.lowerCamel}/g, this.stringService.format(model.name, SentenceFormat.LowerCamelCase));

    return path;
  }

  /**
   * Convert the model to an object containing all its properties
   *
   * @todo Use caching for this method
   * @param {Channel} caller
   * @param {Model} model
   * @param {number} depth
   * @return {Promise<any>}
   * @private
   */
  private async _explicitModel(caller: Channel, model: Model, depth = 0): Promise<any> {

    // Create object
    const m: any = model.toObject();

    // Convert names
    (<any>m).names = this.stringService.formatSentences(m.name);

    // Get and format fields
    const fields = m.fields.map((f: IField) => {
      (<any>f).names = this.stringService.formatSentences(f.name);
      return f;
    });

    // Get primary field
    const primary = fields.find((f: IField) => f.primary);

    // Get unique fields
    const unique = fields.filter((f: IField) => f.unique);

    // Get label fields
    const label = fields.filter((f: IField) => f.label);

    // Get label and searchable fields
    const searchableLabel = fields.filter((f: IField) => f.label && f.searchable);

    // Get nullable fields
    const nullable = fields.filter((f: IField) => f.nullable);

    // Get multiple fields
    const multiple = fields.filter((f: IField) => f.multiple);

    // Get important fields
    const important = fields.filter((f: IField) => f.important);

    // Get searchable fields
    const searchable = fields.filter((f: IField) => f.searchable);

    // Get sortable fields
    const sortable = fields.filter((f: IField) => f.sortable);

    // Get private fields
    const isPrivate = fields.filter((f: IField) => f.isPrivate);

    // Get internal fields
    const internal = fields.filter((f: IField) => f.internal);

    // Get restricted fields
    const restricted = fields.filter((f: IField) => f.restricted);

    // Get ownership fields
    const ownership = fields.filter((f: IField) => f.ownership);

    // Create filter function
    const filter = (func: (f: IField) => boolean = null) => {
      return typeof func === 'function' ?
        fields.filter(func) : fields;
    };

    // Set fields to model
    m.fields = {
      list: fields,
      l: fields,
      f: filter,
      filter,
      primary,
      p: primary,
      unique,
      u: unique,
      label,
      lb: label,
      nullable,
      n: nullable,
      multiple,
      m: multiple,
      important,
      im: important,
      searchable,
      se: searchable,
      sortable,
      so: sortable,
      isPrivate,
      ip: isPrivate,
      internal,
      i: internal,
      restricted,
      r: restricted,
      ownership,
      o: ownership,
      searchableLabel,
      sl: searchableLabel
    };

    // Pre-compute properties
    m.properties = {
      fieldsCount: fields.length,
      hasPrimary: !!primary,
      hasUnique: unique.length > 0,
      hasLabel: label.length > 0,
      hasNullable: nullable.length > 0,
      hasMultiple: multiple.length > 0,
      hasImportant: important.length > 0,
      hasSearchable: searchable.length > 0,
      hasSortable: sortable.length > 0,
      hasPrivate: isPrivate.length > 0,
      hasInternal: internal.length > 0,
      hasRestricted: restricted.length > 0,
      hasOwnership: ownership.length > 0,
      hasSearchableLabel: searchableLabel.length > 0,
      mainlyPrivate: fields.length < 2 * isPrivate.length,
      mainlyInternal: fields.length < 2 * internal.length,
      isGeolocated: fields.filter((f: IField) => f.type === 'number' && f.subtype === 'latitude').length > 0 &&
                    fields.filter((f: IField) => f.type === 'number' && f.subtype === 'longitude').length > 0
    };

    // ==========================================
    // ACCESSES
    // ==========================================
    // Compute accesses sub-object for each action
    // For each action, add a boolean for each access that denote if the access type is granted
    const accesses: IActionAccesses[] = [];
    const ordered = Access.list();
    const indexes = {
      admin: ordered.indexOf(Access.ADMIN),
      owner: ordered.indexOf(Access.OWNER),
      auth: ordered.indexOf(Access.AUTHENTICATED),
      guest: ordered.indexOf(Access.GUEST),
    };
    for (const action in model.accesses) {
      const accessIndex = ordered.indexOf(model.accesses[action]);
      const description: IActionAccesses = {
        action: action,
        admin: accessIndex === indexes.admin,
        owner: accessIndex === indexes.owner,
        auth: accessIndex === indexes.auth,
        guest: accessIndex === indexes.guest,
        gtAdmin: accessIndex > indexes.admin,
        gtOwner: accessIndex > indexes.owner,
        gtAuth: accessIndex > indexes.auth,
        gtGuest: accessIndex > indexes.guest,
        ltAdmin: accessIndex < indexes.admin,
        ltOwner: accessIndex < indexes.owner,
        ltAuth: accessIndex < indexes.auth,
        ltGuest: accessIndex < indexes.guest,
      };
      accesses.push(description);
    }

    // Get admin actions
    const admin = accesses.filter((a: IActionAccesses) => a.admin);

    // Get owner actions
    const owner = accesses.filter((a: IActionAccesses) => a.owner);

    // Get auth actions
    const auth = accesses.filter((a: IActionAccesses) => a.auth);

    // Get guest actions
    const guest = accesses.filter((a: IActionAccesses) => a.guest);

    // Get actions
    const actionCreate = accesses.find((a: IActionAccesses) => a.action === 'create');
    const actionRead = accesses.find((a: IActionAccesses) => a.action === 'read');
    const actionUpdate = accesses.find((a: IActionAccesses) => a.action === 'update');
    const actionRemove = accesses.find((a: IActionAccesses) => a.action === 'remove');
    const actionSearch = accesses.find((a: IActionAccesses) => a.action === 'search');
    const actionCount = accesses.find((a: IActionAccesses) => a.action === 'count');

    // Pre-computed properties
    const propertiesAccess = {
      onlyAdmin: admin.length === accesses.length,
      onlyOwner: owner.length === accesses.length,
      onlyAuth: auth.length === accesses.length,
      onlyGuest: guest.length === accesses.length,
      maxAdmin: admin.length > 0 && owner.length === 0 && auth.length === 0 && guest.length === 0,
      maxOwner: owner.length > 0 && auth.length === 0 && guest.length === 0,
      maxAuth: auth.length > 0 && guest.length === 0,
      maxGuest: guest.length > 0,
      noAdmin: admin.length === 0,
      noOwner: owner.length === 0,
      noAuth: auth.length === 0,
      noGuest: guest.length === 0,
      hasAdmin: admin.length > 0,
      hasOwner: owner.length > 0,
      hasAuth: auth.length > 0,
      hasGuest: guest.length > 0,
    };

    // Create filter function
    const filterAccess = (func: (a: IActionAccesses) => boolean = null) => {
      return typeof func === 'function' ?
        accesses.filter(func) : fields;
    };
    m.accesses = {
      list: accesses,
      l: accesses,
      filter: filterAccess,
      f: filterAccess,
      properties: propertiesAccess,
      p: propertiesAccess,
      // By access
      admin,
      ad: admin,
      owner,
      ow: owner,
      auth,
      au: auth,
      guest,
      gs: guest,
      // By actions
      create: actionCreate,
      c: actionCreate,
      read: actionRead,
      r: actionRead,
      update: actionUpdate,
      u: actionUpdate,
      remove: actionRemove,
      d: actionRemove,
      search: actionSearch,
      s: actionSearch,
      count: actionCount,
      n: actionCount,
    };

    // Add references and dependencies on first level
    if (depth === 0) {

      // ==========================================
      // REFERENCES
      // ==========================================
      // Construct promises
      // Then explicit the reference. If no reference is found returns null (it will be filtered after)
      const promisesRef = fields.filter((f: IField) => (f.type === FieldType.Entity) && f.reference)
        .map((field: any) => {
          return caller.modelsCollection.find(field.reference)
            .then(async (reference) => {
              // Nothing found
              if (!reference) {
                return null;
              }
              // Add reference to object
              const subField = await this._explicitModel(caller, reference, depth + 1);
              field.model = subField;
              field.m = subField;

              return field;
            });
        });

      // Get reference fields
      const references = (await Promise.all(promisesRef)).filter((f) => f);

      // Add to object
      m.fields.references = references;
      m.fields.references.f = m.fields.references.filter;
      m.fields.r = references;
      m.fields.r.f = m.fields.r.filter;

      // ==========================================
      // DEPENDENCIES
      // ==========================================
      // Create method to reduce references to dependencies
      // A custom filter can be passed
      // If the second argument is false, keep the self dependency
      const dependencies = (customFilter = (f: any) => f, removeSelf: boolean = true) => {
        const duplicates: any = {};
        return references
          // Apply custom filter
          .filter(customFilter)
          // Remove self
          .filter((ref: any) => removeSelf ? ref.model.id !== model.id : true)
          // Remove duplicates
          .filter((ref: any) => {
            if (duplicates[ref.reference] === true) {
              return false;
            }
            duplicates[ref.reference] = true;
            return true;
          })
          // Extract models
          .map((ref: any) => ref.model);
      };

      // A boolean to determine if the model has a self dependency
      const selfDependency = !!references.find((ref: any) => ref.model.id === model.id);

      const allDependencies = dependencies();
      m.dependencies = {
        list: allDependencies,
        l: allDependencies,
        filter: dependencies,
        f: dependencies,
        self: selfDependency,
        s: selfDependency
      };
      m.d = m.dependencies;
      m.properties.hasDependencies = allDependencies.length > 0;

      // ==========================================
      // REFERENCED IN
      // ==========================================
      // Parse all models and find where it as been referenced
      const models = await caller.modelsCollection.list();
      // Filter referencing models
      const extractReferencingFields = (f: IField) => f.type === FieldType.Entity && f.reference === model.id;
      const promisesIn = models
        .filter((m: Model) => !!m.fields.find(extractReferencingFields))
        .map(async (m: Model) => {
          // Get model description (first level) and remove non referencing fields
          const explicited = await this._explicitModel(caller, m, depth + 1);
          explicited.fields = explicited.fields.list.filter(extractReferencingFields);
          explicited.fields.f = explicited.fields.filter;
          explicited.f = explicited.fields;
          return explicited;
        });
      // Get all results
      const referencedIn = await Promise.all(promisesIn);
      m.referencedIn = referencedIn;
      m.referencedIn.f = m.referencedIn.filter;
      m.ri = referencedIn;
      m.properties.isReferenced = referencedIn.length > 0;
    }

    // Add short name
    m.f = m.fields;
    m.p = m.properties;
    m.a = m.accesses;

    return m;
  }

  /**
   * Convert all the models to an array of objects containing all its properties
   *
   * @param {Channel} caller
   * @return {Promise<any[]>}
   * @private
   */
  private async _explicitAllModels(caller: Channel): Promise<any[]> {
    return await Promise.all((await caller.modelsCollection.list())
      .map((mod: Model) => this._explicitModel(caller, mod)));
  }
}
