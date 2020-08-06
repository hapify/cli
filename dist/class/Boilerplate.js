"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Boilerplate = void 0;
class Boilerplate {
    constructor(object) {
        if (object) {
            this.fromObject(object);
        }
    }
    fromObject(object) {
        this.id = object.id;
        this.slug = object.slug;
        this.name = object.name;
        this.git_url = object.git_url;
        return this;
    }
    toObject() {
        return {
            id: this.id,
            slug: this.slug,
            name: this.name,
            git_url: this.git_url,
        };
    }
}
exports.Boilerplate = Boilerplate;
//# sourceMappingURL=Boilerplate.js.map