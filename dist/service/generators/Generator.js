"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const interface_1 = require("../../interface");
const class_1 = require("../../class");
const __1 = require("../");
const enum_1 = require("../../enum");
let GeneratorService = class GeneratorService {
    /**
     * Constructor
     *
     * @param stringService
     * @param hpfGeneratorService
     * @param javaScriptGeneratorService
     */
    constructor(stringService, hpfGeneratorService, javaScriptGeneratorService) {
        this.stringService = stringService;
        this.hpfGeneratorService = hpfGeneratorService;
        this.javaScriptGeneratorService = javaScriptGeneratorService;
    }
    /**
     * Compile for a whole channel
     * @param {Channel} channel
     * @returns {Promise<IGeneratorResult[]>}
     */
    runChannel(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create results stack
            let output = [];
            // For each template, run sub process
            for (const template of channel.templates) {
                const results = yield this.runTemplate(template);
                output = output.concat(results);
            }
            return output;
        });
    }
    /**
     * Compile a template to multiple files.
     * One per model, if applicable.
     *
     * @param {Template} template
     * @returns {Promise<IGeneratorResult[]>}
     */
    runTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            // For each template, build each models
            if (template.needsModel()) {
                // Create results stack
                const output = [];
                const models = yield template.channel().modelsCollection.list();
                for (const model of models) {
                    output.push(yield this._one(template, model));
                }
                return output;
            }
            else {
                return [yield this._all(template)];
            }
        });
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
    run(template, model) {
        return __awaiter(this, void 0, void 0, function* () {
            if (template.needsModel()) {
                if (!model) {
                    throw new Error('Model should be defined for this template');
                }
                return yield this._one(template, model);
            }
            else {
                return yield this._all(template);
            }
        });
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
    path(template, model) {
        if (template.needsModel()) {
            if (!model) {
                throw new Error('Model should be defined for this template');
            }
            return this._path(template.path, model);
        }
        else {
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
    pathPreview(path, model = null) {
        return this._path(path, model);
    }
    /**
     * Returns the input(s) that will be injected in a template
     *
     * @param {Channel} caller
     * @param {Model|null} model
     * @returns {Promise<any|any[]>}
     */
    inputs(caller, model = null) {
        if (model) {
            return this._explicitModel(caller, model);
        }
        else {
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
    _one(template, model) {
        return __awaiter(this, void 0, void 0, function* () {
            // Compute path
            const path = this._path(template.path, model);
            // Get full model description
            const input = yield this._explicitModel(template.channel(), model);
            // Compute content
            let content;
            if (template.engine === enum_1.TemplateEngine.Hpf) {
                content = yield this.hpfGeneratorService.one(input, template);
            }
            else if (template.engine === enum_1.TemplateEngine.JavaScript) {
                content = yield this.javaScriptGeneratorService.one(input, template);
            }
            else {
                throw new Error('Unknown engine');
            }
            return {
                content,
                path
            };
        });
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
    _all(template) {
        return __awaiter(this, void 0, void 0, function* () {
            // Compute path
            const path = this._path(template.path);
            // Get full models description
            const input = yield this._explicitAllModels(template.channel());
            // Compute content
            let content;
            if (template.engine === enum_1.TemplateEngine.Hpf) {
                content = yield this.hpfGeneratorService.all(input, template);
            }
            else if (template.engine === enum_1.TemplateEngine.JavaScript) {
                content = yield this.javaScriptGeneratorService.all(input, template);
            }
            else {
                throw new Error('Unknown engine');
            }
            return {
                content,
                path
            };
        });
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
    _path(path, model = null) {
        // Quick exit
        if (model === null) {
            return path;
        }
        // Apply replacements
        path = path.replace(/{model\.hyphen}/g, this.stringService.format(model.name, enum_1.SentenceFormat.SlugHyphen));
        path = path.replace(/{model\.hyphenUpper}/g, this.stringService.format(model.name, enum_1.SentenceFormat.SlugHyphenUpperCase));
        path = path.replace(/{model\.underscore}/g, this.stringService.format(model.name, enum_1.SentenceFormat.SlugUnderscore));
        path = path.replace(/{model\.underscoreUpper}/g, this.stringService.format(model.name, enum_1.SentenceFormat.SlugUnderscoreUpperCase));
        path = path.replace(/{model\.oneWord}/g, this.stringService.format(model.name, enum_1.SentenceFormat.SlugOneWord));
        path = path.replace(/{model\.upperCamel}/g, this.stringService.format(model.name, enum_1.SentenceFormat.UpperCamelCase));
        path = path.replace(/{model\.lowerCamel}/g, this.stringService.format(model.name, enum_1.SentenceFormat.LowerCamelCase));
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
    _explicitModel(caller, model, depth = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create object
            const m = model.toObject();
            // Convert names
            m.names = this.stringService.formatSentences(m.name);
            // Get and format fields
            const fields = m.fields.map((f) => {
                f.names = this.stringService.formatSentences(f.name);
                return f;
            });
            // Get primary field
            const primary = fields.find((f) => f.primary);
            // Get unique fields
            const unique = fields.filter((f) => f.unique);
            // Get label fields
            const label = fields.filter((f) => f.label);
            // Get label and searchable fields
            const searchableLabel = fields.filter((f) => f.label && f.searchable);
            // Get nullable fields
            const nullable = fields.filter((f) => f.nullable);
            // Get multiple fields
            const multiple = fields.filter((f) => f.multiple);
            // Get important fields
            const important = fields.filter((f) => f.important);
            // Get searchable fields
            const searchable = fields.filter((f) => f.searchable);
            // Get sortable fields
            const sortable = fields.filter((f) => f.sortable);
            // Get private fields
            const isPrivate = fields.filter((f) => f.isPrivate);
            // Get internal fields
            const internal = fields.filter((f) => f.internal);
            // Get restricted fields
            const restricted = fields.filter((f) => f.restricted);
            // Get ownership fields
            const ownership = fields.filter((f) => f.ownership);
            // Create filter function
            const filter = (func = null) => {
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
                isGeolocated: fields.filter((f) => f.type === 'number' && f.subtype === 'latitude').length > 0 &&
                    fields.filter((f) => f.type === 'number' && f.subtype === 'longitude').length > 0,
                isGeoSearchable: fields.filter((f) => f.type === 'number' && f.subtype === 'latitude' && f.searchable).length > 0 &&
                    fields.filter((f) => f.type === 'number' && f.subtype === 'longitude' && f.searchable).length > 0,
            };
            // ==========================================
            // ACCESSES
            // ==========================================
            // Compute accesses sub-object for each action
            // For each action, add a boolean for each access that denote if the access type is granted
            const accesses = [];
            const ordered = interface_1.Access.list();
            const indexes = {
                admin: ordered.indexOf(interface_1.Access.ADMIN),
                owner: ordered.indexOf(interface_1.Access.OWNER),
                auth: ordered.indexOf(interface_1.Access.AUTHENTICATED),
                guest: ordered.indexOf(interface_1.Access.GUEST),
            };
            for (const action in model.accesses) {
                const accessIndex = ordered.indexOf(model.accesses[action]);
                const description = {
                    action: action,
                    admin: accessIndex === indexes.admin,
                    owner: accessIndex === indexes.owner,
                    auth: accessIndex === indexes.auth,
                    guest: accessIndex === indexes.guest,
                    gteAdmin: accessIndex >= indexes.admin,
                    gteOwner: accessIndex >= indexes.owner,
                    gteAuth: accessIndex >= indexes.auth,
                    gteGuest: accessIndex >= indexes.guest,
                    lteAdmin: accessIndex <= indexes.admin,
                    lteOwner: accessIndex <= indexes.owner,
                    lteAuth: accessIndex <= indexes.auth,
                    lteGuest: accessIndex <= indexes.guest,
                };
                accesses.push(description);
            }
            // Get admin actions
            const admin = accesses.filter((a) => a.admin);
            // Get owner actions
            const owner = accesses.filter((a) => a.owner);
            // Get auth actions
            const auth = accesses.filter((a) => a.auth);
            // Get guest actions
            const guest = accesses.filter((a) => a.guest);
            // Get actions
            const actionCreate = accesses.find((a) => a.action === 'create');
            const actionRead = accesses.find((a) => a.action === 'read');
            const actionUpdate = accesses.find((a) => a.action === 'update');
            const actionRemove = accesses.find((a) => a.action === 'remove');
            const actionSearch = accesses.find((a) => a.action === 'search');
            const actionCount = accesses.find((a) => a.action === 'count');
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
            const filterAccess = (func = null) => {
                return typeof func === 'function' ?
                    accesses.filter(func) : accesses;
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
                const promisesRef = fields.filter((f) => (f.type === class_1.FieldType.Entity) && f.reference)
                    .map((field) => {
                    return caller.modelsCollection.find(field.reference)
                        .then((reference) => __awaiter(this, void 0, void 0, function* () {
                        // Nothing found
                        if (!reference) {
                            return null;
                        }
                        // Add reference to object
                        const subField = yield this._explicitModel(caller, reference, depth + 1);
                        field.model = subField;
                        field.m = subField;
                        return field;
                    }));
                });
                // Get reference fields
                const references = (yield Promise.all(promisesRef)).filter((f) => f);
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
                const dependencies = (customFilter = (f) => f, removeSelf = true) => {
                    const duplicates = {};
                    return references
                        // Apply custom filter
                        .filter(customFilter)
                        // Remove self
                        .filter((ref) => removeSelf ? ref.model.id !== model.id : true)
                        // Remove duplicates
                        .filter((ref) => {
                        if (duplicates[ref.reference] === true) {
                            return false;
                        }
                        duplicates[ref.reference] = true;
                        return true;
                    })
                        // Extract models
                        .map((ref) => ref.model);
                };
                // A boolean to determine if the model has a self dependency
                const selfDependency = !!references.find((ref) => ref.model.id === model.id);
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
                const models = yield caller.modelsCollection.list();
                // Filter referencing models
                const extractReferencingFields = (f) => f.type === class_1.FieldType.Entity && f.reference === model.id;
                const promisesIn = models
                    .filter((m) => !!m.fields.find(extractReferencingFields))
                    .map((m) => __awaiter(this, void 0, void 0, function* () {
                    // Get model description (first level) and remove non referencing fields
                    const explicited = yield this._explicitModel(caller, m, depth + 1);
                    explicited.fields = explicited.fields.list.filter(extractReferencingFields);
                    explicited.fields.f = explicited.fields.filter;
                    explicited.f = explicited.fields;
                    return explicited;
                }));
                // Get all results
                const referencedIn = yield Promise.all(promisesIn);
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
        });
    }
    /**
     * Convert all the models to an array of objects containing all its properties
     *
     * @param {Channel} caller
     * @return {Promise<any[]>}
     * @private
     */
    _explicitAllModels(caller) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Promise.all((yield caller.modelsCollection.list())
                .map((mod) => this._explicitModel(caller, mod)));
        });
    }
};
GeneratorService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [__1.StringService,
        __1.HpfGeneratorService,
        __1.JavaScriptGeneratorService])
], GeneratorService);
exports.GeneratorService = GeneratorService;
//# sourceMappingURL=Generator.js.map