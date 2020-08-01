"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preset = void 0;
const Model_1 = require("./Model");
class Preset {
    /** Constructor */
    constructor(object) {
        if (object) {
            this.fromObject(object);
        }
    }
    /** @inheritDoc */
    fromObject(object) {
        this.id = object.id;
        this.icon = object.icon;
        this.name = object.name;
        this.name__fr = object.name__fr;
        this.description = object.description;
        this.description__fr = object.description__fr;
        this.models = object.models.map((m) => new Model_1.Model(m));
        return this;
    }
    /** @inheritDoc */
    toObject() {
        return {
            id: this.id,
            icon: this.icon,
            name: this.name,
            name__fr: this.name__fr,
            description: this.description,
            description__fr: this.description__fr,
            models: this.models.map((m) => m.toObject()),
        };
    }
}
exports.Preset = Preset;
//# sourceMappingURL=Preset.js.map