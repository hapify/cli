"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindBoilerplate = exports.AskBoilerplate = void 0;
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
            qBoilerplate.urls = [cmd.boilerplateUrl];
        }
        else {
            // Get boilerplates from remote
            const list = (yield boilerplatesCollection.list()).map(b => ({
                name: b.name,
                value: b.git_url
            }));
            yield addBoilerplate(list, qBoilerplate);
        }
        if (!qBoilerplate.id && !qBoilerplate.slug && !qBoilerplate.urls) {
            throw new Error('No boilerplate is defined');
        }
    });
}
exports.AskBoilerplate = AskBoilerplate;
function FindBoilerplate(qBoilerplate) {
    return __awaiter(this, void 0, void 0, function* () {
        const boilerplatesCollection = yield typedi_1.Container.get(service_1.BoilerplatesService).collection();
        if (!qBoilerplate.urls) {
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
            qBoilerplate.urls = [boilerplate.git_url];
        }
    });
}
exports.FindBoilerplate = FindBoilerplate;
function addBoilerplate(list, qBoilerplate) {
    return __awaiter(this, void 0, void 0, function* () {
        const answer = (yield Inquirer.prompt([
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
                validate: (input) => input.length > 0
            },
            {
                name: 'more',
                message: 'Add another boilerplate?',
                type: 'confirm',
                default: false
            }
        ]));
        // Create if first one
        if (!qBoilerplate.urls) {
            qBoilerplate.urls = [];
        }
        // Avoid duplicates
        if (qBoilerplate.urls.indexOf(answer.url) < 0) {
            qBoilerplate.urls.push(answer.url);
        }
        // Push more if needed
        if (answer.more) {
            yield addBoilerplate(list, qBoilerplate);
        }
    });
}
//# sourceMappingURL=Boilerplate.js.map