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
const Fs = __importStar(require("fs"));
const class_1 = require("../class");
const SimpleGit = require('simple-git/promise');
// ############################################
// Get services
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
const presets = typedi_1.Container.get(service_1.PresetsService);
const boilerplates = typedi_1.Container.get(service_1.BoilerplatesService);
const projects = typedi_1.Container.get(service_1.ProjectsService);
const channels = typedi_1.Container.get(service_1.ChannelsService);
function NewCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            options.setCommand(cmd);
            const qProject = {};
            const qBoilerplate = {};
            let qPresets = [];
            // ---------------------------------
            // Verify current dir
            const currentDir = options.dir();
            const files = Fs.readdirSync(currentDir);
            if (files.length) {
                throw new Error('Current folder is not empty, cannot create a new project.');
            }
            // ---------------------------------
            // Action starts
            const projectsCollection = yield projects.collection();
            const boilerplatesCollection = yield boilerplates.collection();
            const presetsCollection = yield presets.collection();
            // =================================
            // Get project
            if (cmd.project) {
                qProject.id = cmd.project;
            }
            else if (cmd.projectName) {
                qProject.name = cmd.projectName;
                qProject.description = cmd.projectDescription;
            }
            else {
                // Get projects from remote
                const list = (yield projectsCollection.list()).map(b => ({
                    name: b.name,
                    value: b.id
                }));
                const answer = yield Inquirer.prompt([
                    {
                        name: 'id',
                        message: 'Choose a project',
                        type: 'list',
                        choices: [
                            { name: 'Create a new project', value: null },
                            new Inquirer.Separator(),
                            ...list
                        ],
                        when: () => list.length > 0
                    },
                    {
                        name: 'name',
                        message: 'Enter a project name',
                        when: (answer) => !answer.id,
                        validate: input => input.length > 0
                    },
                    {
                        name: 'description',
                        message: 'Enter a project description',
                        when: (answer) => !answer.id
                    }
                ]);
                qProject.id = answer.id;
                qProject.name = answer.name;
                qProject.description = answer.description;
            }
            // =================================
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
            // =================================
            // Get presets
            if (cmd.preset && cmd.preset.length) {
                qPresets = cmd.preset;
            }
            else {
                // Get presets from remote
                const list = (yield presetsCollection.list()).map(p => ({
                    name: p.name,
                    value: p.id
                }));
                qPresets = (yield Inquirer.prompt([
                    {
                        name: 'presets',
                        message: 'Choose some presets to preload in your project',
                        type: 'checkbox',
                        choices: list,
                        when: () => list.length > 0
                    }
                ])).presets;
            }
            // =================================
            // Check validity
            if (!qProject.id && !qProject.name) {
                throw new Error('No project is defined');
            }
            if (!qBoilerplate.id && !qBoilerplate.slug && !qBoilerplate.url) {
                throw new Error('No boilerplate is defined');
            }
            // =================================
            // Create project if necessary
            if (!qProject.id) {
                const project = yield projectsCollection.add(qProject.name, qProject.description);
                qProject.id = project.id;
            }
            // =================================
            // Get boilerplate URL
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
            // =================================
            // Clone git repo
            const git = SimpleGit(currentDir);
            yield git.clone(qBoilerplate.url, currentDir);
            // =================================
            // Init & validate channel for this new folder
            yield class_1.Channel.changeProject(currentDir, qProject.id);
            const modelsCollection = yield channels.modelsCollection();
            // =================================
            // Get models and apply presets if necessary
            if (qPresets && qPresets.length) {
                const models = yield modelsCollection.list();
                // If the project already has models, ignore add presets
                if (models.length) {
                    logger.warning('Project already contains models. Ignore presets import.');
                }
                else {
                    // Get and apply presets
                    for (const id of qPresets) {
                        const preset = yield presetsCollection.get(id);
                        const results = yield presets.apply(preset.models);
                        yield modelsCollection.add(results.created);
                        yield modelsCollection.update(results.updated);
                    }
                    // Save models
                    yield modelsCollection.save();
                }
            }
            logger.success(`Created a new dynamic boilerplate in ${helpers_1.cPath(currentDir)}. Run 'hpf serve' to edit.`);
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