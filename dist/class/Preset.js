"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class Preset {
    /** Constructor */
    constructor() { }
    /** @inheritDoc */
    fromObject(object) {
        this.id = object.id;
        this.icon = object.icon;
        this.name = object.name;
        this.models = object.models.map((modelBase) => {
            const model = new _1.Model();
            return model.fromObject(modelBase);
        });
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            id: this.id,
            icon: this.icon,
            name: this.name,
            models: this.models.map((model) => model.toObject()),
        };
    }
}
exports.Preset = Preset;
//# sourceMappingURL=Preset.js.map