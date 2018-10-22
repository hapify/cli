# Hapify

## Model injected in the templates

### Object types

The following objects will be available in the template.

**Model object**

- `id` (string): an unique id
- `name` (string): The name of the model, as the user entered it.
- `names` (object): All names computed from the `name` property.
    - `raw` (string): The name of the model, as the user entered it. Example `Online item`.
    - `hyphen` (string): The name with hyphens and lower case. Example `online-item`.
    - `hyphenUpper` (string): The name with hyphens and upper case. Example `ONLINE-ITEM`.
    - `underscore` (string): The name with underscores and lower case. Example `online_item`.
    - `underscoreUpper` (string): The name with underscores and upper case. Example `ONLINE_ITEM`.
    - `oneWord` (string): The name joined and lower case. Example `onlineitem`.
    - `lowerCamel` (string): The name as lower camel case. Example `onlineItem`.
    - `upperCamel` (string): The name as upper camel case. Example `OnlineItem`.
    - `wordsLower` (string): The name as words in lower case. Example `online item`.
    - `wordsUpper` (string): The name as words with upper case on first letters. Example `Online Item`.
- `fields` - alias `f` (object): An object containing all fields, grouped in different arrays.
    - `list` - alias `l` (array): An array containing all fields of the model.
    - `primary` - alias `p` (Field): The primary field of the model. `null` if no primary field is defined.
    - `unique` - alias `u` (array): An array containing all fields flagged as `unique`.
    - `label` - alias `lb` (array): An array containing all fields flagged as `label`.
    - `nullable` - alias `n` (array): An array containing all fields flagged as `nullable`.
    - `multiple` - alias `m` (array): An array containing all fields flagged as `multiple`.
    - `searchable` - alias `se` (array): An array containing all fields flagged as `searchable`.
    - `sortable` - alias `so` (array): An array containing all fields flagged as `sortable`.
    - `isPrivate` - alias `ip` (array): An array containing all fields flagged as `private`.
    - `internal` - alias `i` (array): An array containing all fields flagged as `internal`.
    - `important` - alias `im` (array): An array containing all fields flagged as `important`.
    - `searchableLabel` - alias `sl` (array): An array containing all fields flagged as `label` and `searchable`. Useful for quick-search by label.
    - `filter` - alias `f` (Function): A function for filtering fields with a custom rule. Equivalent of `model.fields.list.filter`.
    - `references` - alias `r` - non-deep model only (array): An array containing all fields of type `entity`.
        - `filter` - alias `f` (function): A function for filtering the array.
- `dependencies` - alias `d` - non-deep model only (object): An object containing dependencies (to other models) of this model. A model has a dependency if one of this field is of type `entity`.
    - `list` - alias `l` (array): An array containing all dependency models, but self. These models are added as "deep models".
    - `self` - alias `s` (boolean): A boolean indicating if this model has a self-dependency.
    - `filter` - alias `f` (function): A function to filter dependencies.
        - First argument (function - default `(f) => f`): The filtering function receiving the referencer field (the entity field).
        - Second argument (boolean - default `true`): A boolean indicating if we should filter the self dependency.
- `referencedIn` - alias `ri` - non-deep model only (array): An array containing models that refer to this one. These models are added as "deep models".
    - `filter` - alias `f` (function): A function for filtering the array.
- `properties` - alias `p` (object): An array containing pre-computed properties from fields.
    - `fieldsCount` (number): The number of fields contained in the model.
    - `hasPrimary` (boolean): Denotes if the model has a primary field.
    - `hasUnique` (boolean): Denotes if the model has at least one unique field.
    - `hasLabel` (boolean): Denotes if the model has at least one label field.
    - `hasNullable` (boolean): Denotes if the model has at least one nullable field.
    - `hasMultiple` (boolean): Denotes if the model has at least one multiple field.
    - `hasSearchable` (boolean): Denotes if the model has at least one searchable field.
    - `hasSortable` (boolean): Denotes if the model has at least one sortable field.
    - `hasPrivate` (boolean): Denotes if the model has at least one private field.
    - `hasInternal` (boolean): Denotes if the model has at least one internal field.
    - `hasImportant` (boolean): Denotes if the model has at least one important field.
    - `hasSearchableLabel` (boolean): Denotes if the model has at least one field marked as label and also searchable.
    - `hasDependencies` - non-deep model only (boolean): Denotes if the model has dependencies to other models or itself (through an `entity` field).
    - `isReferenced` - non-deep model only (boolean): Denotes if the model is referenced by other models.
    - `mainlyPrivate` (boolean): Denotes if most of the fields are private (strictly).
    - `mainlyInternal` (boolean): Denotes if most of the fields are internal (strictly).
    - `isGeolocated` (boolean): Denotes if the model contains at least one latitude field and one longitude field.
            
**Field object**

- `name` (string): The name of the field, as the user entered it.
- `names` (object): All names computed from the `name` property. As for the field object.
    - `raw` (string): The name of the field, as the user entered it. Example `first_name`.
    - `hyphen` (string): The name with hyphens and lower case. Example `first-name`.
    - `hyphenUpper` (string): The name with hyphens and upper case. Example `FIRST-NAME`.
    - `underscore` (string): The name with underscores and lower case. Example `first_name`.
    - `underscoreUpper` (string): The name with underscores and upper case. Example `FIRST_NAME`.
    - `oneWord` (string): The name joined and lower case. Example `firstname`.
    - `lowerCamel` (string): The name as lower camel case. Example `firstName`.
    - `upperCamel` (string): The name as upper camel case. Example `FirstName`.
    - `wordsLower` (string): The name as words in lower case. Example `first name`.
    - `wordsUpper` (string): The name as words with upper case on first letters. Example `First Name`.
- `primary` (boolean): Indicates if the field is flagged as `primary`.
- `unique` (boolean): Indicates if the field is flagged as `unique`.
- `label` (boolean): Indicates if the field is flagged as `label`.
- `nullable` (boolean): Indicates if the field is flagged as `nullable`.
- `multiple` (boolean): Indicates if the field is flagged as `multiple`.
- `searchable` (boolean): Indicates if the field is flagged as `searchable`.
- `sortable` (boolean): Indicates if the field is flagged as `sortable`.
- `isPrivate` (boolean): Indicates if the field is flagged as `private`.
- `internal` (boolean): Indicates if the field is flagged as `internal`.
- `important` (boolean): Indicates if the field is flagged as `important`.
- `type` (string): The type of the field. Can be `string`, `number`, `boolean`, `datetime` or `entity`.
- `subtype` (string): The subtype of the field. The available values depend on the `type`:
    - `string`: Can be `null`, `email`, `password` `text` or `rich`.
    - `number`: Can be `null`, `integer`, `float`, `latitude` or `longitude`.
    - `boolean`: Is `null`.
    - `datetime`: Can be `null`, `date` or `time`.
    - `entity`: Is `null`.
- `reference` (string): The id of the target model if the field is of type `entity`. `null` otherwise
- `model` - alias `m` (object): The target model object if the field is of type `entity`. `null` otherwise

### Model injection

#### Single model

If the template requires all the models, therefore, a object `model` (alias `m`) will be available as a global variable in the template.
In a `dot.js` template it will be available under `{{=it.model}}` or `{{=it.m}}`

#### Multiple models

If the template requires all the models, therefore, an array `models` (alias `m`) will be available as a global variable in the template.
This array contains all the models defined.
In a `dot.js` template it will be available under `{{=it.models}}` or `{{=it.m}}`

## Auto-Sync compiled files

On development, when editing templates via the editor, you can automatically sync the compiled files to your bootstraps.
To run the web-app with this auto-sync mode, run `npm run start-sync`.

For more information, go to `sync/README.md`.
