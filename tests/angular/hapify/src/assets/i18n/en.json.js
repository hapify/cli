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
    const modelKey = model.names.snake;
    return model.fields.list
        .filter((f) => !f.internal)
        .reduce((p, f) => {
            const key = f.names.snake;
            p[`${modelKey}_placeholder_${key}`] = `${f.names.capital}`;
            p[`${modelKey}_error_${key}_required`] = `The ${f.names.lower} is required`;
            p[`${modelKey}_error_${key}_format`] = `Wrong ${f.names.lower} format`;
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
    const modelKey = model.names.snake;
    return model.fields.list
        .filter((f) => !(f.hidden || f.primary))
        .reduce((p, f) => {
            const key = f.names.snake;
            p[`${modelKey}_title_${key}`] = `${f.names.capital}`;
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
                const key = `${model.names.snake}_title_${r.names.snake}_as_${f.names.snake}`;
                output[key] = `${r.names.capital} As ${f.names.capital}`;
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
    const modelKey = model.names.snake;
    return model.fields.searchable
        .reduce((p, f) => {
            const key = f.names.snake;
            p[`${modelKey}_filter_${key}`] = `${f.names.capital}`;
            if (f.type === 'number' || f.type === 'datetime') {
                p[`${modelKey}_filter_${key}__min`] = `${f.names.capital} min`;
                p[`${modelKey}_filter_${key}__max`] = `${f.names.capital} max`;
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
    const modelKey = model.names.snake;
    return model.fields.list
        .filter((f) => !(f.hidden))
        .reduce((p, f) => {
            const key = f.names.snake;
            p[`${modelKey}_list_title_${key}`] = `${f.names.capital}`;
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
            [`${model.names.snake}_select_filter_placeholder`]: `Search ${model.names.lower}`
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
    const modelKey = model.names.snake;
    const modelWords = model.names.lower;
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
return JSON.stringify(_output, null, 2);
