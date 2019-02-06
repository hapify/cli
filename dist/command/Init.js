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
const class_1 = require("../class");
const typedi_1 = require("typedi");
const service_1 = require("../service");
const helpers_1 = require("./helpers");
const Inquirer = __importStar(require("inquirer"));
// ############################################
// Get services
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
const projects = typedi_1.Container.get(service_1.ProjectsService);
function InitCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            options.setCommand(cmd);
            const qProject = {};
            // ---------------------------------
            // Action starts
            const projectsCollection = yield projects.collection();
            // =================================
            // Init channel to save
            const channel = yield class_1.Channel.create(options.dir());
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
            // Create project if necessary
            if (!qProject.id) {
                const project = yield projectsCollection.add(qProject.name, qProject.description);
                qProject.id = project.id;
            }
            // =================================
            // Set project in channel and save
            channel.config.project = qProject.id;
            yield channel.save();
            logger.success(`Initialized a dynamic boilerplate in ${helpers_1.cPath(options.dir())}`);
            // Action Ends
            // ---------------------------------
            logger.time();
        }
        catch (error) {
            logger.handle(error);
        }
    });
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=Init.js.map