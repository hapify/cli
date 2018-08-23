// Static words
let _output = {
    error_dismiss_action: "Ok",
    header_app_name: "Hapify - Admin dashboard",
    header_app_short_name: "Hapify",
    header_sign_in: "Sign in",
    header_action_logout: "Logout",
    footer_tag_line: "© {{year}} - Tractr",
    session_sign_in: "Sign in",
    session_logout: "Logout",
    session_email: "Email",
    session_password: "Password",
    home_title: "Hapify"
};

/**
 * Generate the create/update part of a model
 *
 * @param model
 * @private
 */
function __create(model) {
    const modelKey = model.names.underscore;
    return model.fields.list
        .filter((f) => !f.internal)
        .reduce((p, f) => {
            const key = f.names.underscore;
            p[`${modelKey}_placeholder_${key}`] = `${f.names.wordsUpper}`;
            p[`${modelKey}_error_${key}_required`] = `The ${f.names.wordsLower} is required`;
            p[`${modelKey}_error_${key}_format`] = `Wrong ${f.names.wordsLower} format`;
            return p;
        }, {});
}

/**
 * Generate the read part of a model
 *
 * @param model
 * @private
 */
function __read(model) {
    const modelKey = model.names.underscore;
    return model.fields.list
        .filter((f) => !(f.isPrivate || f.primary))
        .reduce((p, f) => {
            const key = f.names.underscore;
            p[`${modelKey}_title_${key}`] = `${f.names.wordsUpper}`;
            if (f.type === 'boolean') {
                p[`${modelKey}_${key}_true`] = 'Yes';
                p[`${modelKey}_${key}_false`] = 'No';
            }
            return p;
        }, {});
}

/**
 * Generate the Referenced In part of a model
 *
 * @param model
 * @private
 */
function __referenced_in(model) {
    const output = {};
    model.referencedIn.map((r) => {
        r.fields
            .filter(f => f.searchable)
            .map((f) => {
                const key = `${model.names.underscore}_title_${r.names.underscore}_as_${f.names.underscore}`;
                output[key] = `${r.names.wordsUpper} As ${f.names.wordsUpper}`;
            });
    });
    return output;
}

/**
 * Generate the filter of a model
 *
 * @param model
 * @private
 */
function __filter(model) {
    const modelKey = model.names.underscore;
    return model.fields.searchable
        .reduce((p, f) => {
            const key = f.names.underscore;
            p[`${modelKey}_filter_${key}`] = `${f.names.wordsUpper}`;
            if (f.type === 'number' || f.type === 'datetime') {
                p[`${modelKey}_filter_${key}__min`] = `${f.names.wordsUpper} min`;
                p[`${modelKey}_filter_${key}__max`] = `${f.names.wordsUpper} max`;
            }
            else if (f.type === 'entity') {
                if (!f.multiple) {
                    p[`${modelKey}_filter_${key}_any`] = `Any`;   
                }
            }
            else if (f.type === 'boolean') {
                p[`${modelKey}_filter_${key}_true`] = 'Yes';
                p[`${modelKey}_filter_${key}_false`] = 'No';
                p[`${modelKey}_filter_${key}_any`] = 'Any';
            }
            return p;
        }, {});
}

/**
 * Generate the filter of a model
 *
 * @param model
 * @private
 */
function __list(model) {
    const modelKey = model.names.underscore;
    return model.fields.list
        .filter((f) => !(f.isPrivate))
        .reduce((p, f) => {
            const key = f.names.underscore;
            p[`${modelKey}_list_title_${key}`] = `${f.names.wordsUpper}`;
            return p;
        }, {});
}

/**
 * Generate the selector of a model
 *
 * @param model
 * @private
 */
function __select(model) {
    if (model.p.hasSearchableLabel) {
        return {
            [`${model.names.underscore}_select_filter_placeholder`]: `Search ${model.names.wordsLower}`
        };
    }
    return {};
}

/**
 * Generate a model
 *
 * @param model
 * @private
 */
function __model(model) {
    const modelKey = model.names.underscore;
    const modelWords = model.names.wordsLower;
    return Object.assign(
        {
            [`${modelKey}_action_save`]: `Save ${modelWords}`,
            [`${modelKey}_action_edit`]: `Edit ${modelWords}`,
            [`${modelKey}_action_delete`]: `Delete ${modelWords}`,
            [`${modelKey}_action_create`]: `Create ${modelWords}`,
            [`${modelKey}_list_nothing`]: `No ${modelWords} found`,
        },
        __create(model),
        __read(model),
        __filter(model),
        __list(model),
        __referenced_in(model),
        __select(model)
    )
}


//--------------------------------------------------
//  Output
//--------------------------------------------------
models.map((model) => {
    _output = Object.assign(_output, __model(model));
});
module.export = JSON.stringify(_output, null, 2);
