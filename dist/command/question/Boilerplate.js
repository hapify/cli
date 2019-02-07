"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inquirer = __importStar(require("inquirer"));
const typedi_1 = require("typedi");
const service_1 = require("../../service");
function AskBoilerplate(cmd, qBoilerplate) {
    return __awaiter(this, void 0, void 0, function* () {
        const boilerplatesCollection = yield typedi_1.Container.get(service_1.BoilerplatesService).collection();
        if (cmd.boilerplate) {
            qBoilerplate.slug = cmd.boilerplate;
        }
        else if (cmd.boilerplateId) {
            qBoilerplate.id = cmd.boilerplateId;
        }
        else if (cmd.boilerplateUrl) {
            qBoilerplate.url = cmd.boilerplateUrl;
        }
        else {
            // Get boilerplates from remote
            const list = (yield boilerplatesCollection.list()).map(b => ({
                name: b.name,
                value: b.git_url
            }));
            qBoilerplate.url = (yield Inquirer.prompt([
                {
                    name: 'url',
                    message: 'Choose a boilerplate',
                    type: 'list',
                    choices: [
                        { name: 'Enter a Git URL', value: null },
                        new Inquirer.Separator(),
                        ...list
                    ],
                    when: () => list.length > 0
                },
                {
                    name: 'url',
                    message: 'Enter boilerplate URL',
                    when: (answer) => !answer.url,
                    validate: input => input.length > 0
                }
            ])).url;
        }
        if (!qBoilerplate.id && !qBoilerplate.slug && !qBoilerplate.url) {
            throw new Error('No boilerplate is defined');
        }
    });
}
exports.AskBoilerplate = AskBoilerplate;
function FindBoilerplate(qBoilerplate) {
    return __awaiter(this, void 0, void 0, function* () {
        const boilerplatesCollection = yield typedi_1.Container.get(service_1.BoilerplatesService).collection();
        if (!qBoilerplate.url) {
            let boilerplate;
            if (qBoilerplate.slug) {
                boilerplate = yield boilerplatesCollection.getBySlug(qBoilerplate.slug);
            }
            else if (qBoilerplate.id) {
                boilerplate = yield boilerplatesCollection.get(qBoilerplate.id);
            }
            if (!boilerplate) {
                throw new Error('Boilerplate not found');
            }
            qBoilerplate.url = boilerplate.git_url;
        }
    });
}
exports.FindBoilerplate = FindBoilerplate;
//# sourceMappingURL=Boilerplate.js.map