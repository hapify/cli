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
exports.SetupProject = exports.AskProject = void 0;
const Inquirer = __importStar(require("inquirer"));
const typedi_1 = require("typedi");
const service_1 = require("../../service");
function AskProject(cmd, qProject) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectsCollection = yield typedi_1.Container.get(service_1.ProjectsService).collection();
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
                    validate: (input) => input.length > 0
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
        if (!qProject.id && !qProject.name) {
            throw new Error('No project is defined');
        }
    });
}
exports.AskProject = AskProject;
function SetupProject(qProject) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectsCollection = yield typedi_1.Container.get(service_1.ProjectsService).collection();
        if (!qProject.id) {
            const project = yield projectsCollection.add(qProject.name, qProject.description);
            qProject.id = project.id;
        }
    });
}
exports.SetupProject = SetupProject;
//# sourceMappingURL=Project.js.map