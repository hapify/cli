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
const typedi_1 = require("typedi");
const service_1 = require("../service");
const helpers_1 = require("./helpers");
const Inquirer = __importStar(require("inquirer"));
const class_1 = require("../class");
// ############################################
// Get services
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
function NewCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            options.setCommand(cmd);
            const qProject = {};
            const qBoilerplate = {};
            let qPresets = [];
            // ---------------------------------
            // Action starts
            // Get project
            if (cmd.project) {
                qProject.id = cmd.project;
            }
            else if (cmd.projectName) {
                qProject.name = cmd.projectName;
                qProject.description = cmd.projectDescription;
            }
            else {
                const answer = yield Inquirer.prompt([
                    {
                        name: 'name',
                        message: 'Enter a project name',
                        validate: input => input.length > 0
                    },
                    {
                        name: 'description',
                        message: 'Enter a project description'
                    }
                ]);
                qProject.name = answer.name;
                qProject.description = answer.description;
            }
            // Get boilerplate
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
                const boilerplates = (yield (yield class_1.BoilerplatesCollection.getInstance()).list()).map(b => ({ name: b.name, value: b.git_url }));
                qBoilerplate.url = (yield Inquirer.prompt([
                    {
                        name: 'url',
                        message: 'Choose a boilerplate',
                        type: 'list',
                        choices: [
                            { name: 'Enter URL', value: null },
                            new Inquirer.Separator(),
                            ...boilerplates
                        ]
                    },
                    {
                        name: 'url',
                        message: 'Enter boilerplate URL',
                        when: answer => !answer.url,
                        validate: input => input.length > 0
                    }
                ])).url;
            }
            // Get presets
            if (cmd.preset && cmd.preset.length) {
                qPresets = cmd.preset;
            }
            else {
                // Get presets from remote
                const presets = (yield (yield class_1.PresetsCollection.getInstance()).list()).map(p => ({ name: p.name, value: p.id }));
                qPresets = (yield Inquirer.prompt([
                    {
                        name: 'presets',
                        message: 'Choose some preset to preload in your project',
                        type: 'checkbox',
                        choices: presets
                    }
                ])).presets;
            }
            const query = {
                project: qProject,
                boilerplate: qBoilerplate,
                presets: qPresets
            };
            logger.info(JSON.stringify(query, null, 4));
            logger.success(`Created a new dynamic boilerplate in ${helpers_1.cPath(options.dir())}`);
            // Action Ends
            // ---------------------------------
            logger.time();
        }
        catch (error) {
            logger.handle(error);
        }
    });
}
exports.NewCommand = NewCommand;
//# sourceMappingURL=New.js.map