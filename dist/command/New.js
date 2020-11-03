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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.NewCommand = void 0;
const typedi_1 = require("typedi");
const helpers_1 = require("./helpers");
const Rimraf = __importStar(require("rimraf"));
const Fs = __importStar(require("fs"));
const Path = __importStar(require("path"));
const Options_1 = require("../service/Options");
const Logger_1 = require("../service/Logger");
const Channels_1 = require("../service/Channels");
const Project_1 = require("./question/Project");
const Boilerplate_1 = require("./question/Boilerplate");
const Preset_1 = require("./question/Preset");
const SimpleGit = require('simple-git/promise');
const GetDirectories = (s) => Fs.readdirSync(s)
    .map((n) => Path.join(s, n))
    .filter((d) => Fs.lstatSync(d).isDirectory());
function NewCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get services
        const options = typedi_1.Container.get(Options_1.OptionsService);
        const logger = typedi_1.Container.get(Logger_1.LoggerService);
        const channelsService = typedi_1.Container.get(Channels_1.ChannelsService);
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        const qProject = {};
        const qBoilerplate = {};
        // ---------------------------------
        // Verify current dir
        const currentDir = options.dir();
        const files = Fs.readdirSync(currentDir);
        if (files.length) {
            throw new Error('Current folder is not empty, cannot create a new project.');
        }
        // =================================
        // Get boilerplate
        yield Boilerplate_1.AskBoilerplate(cmd, qBoilerplate);
        // =================================
        // Get presets
        const qPresets = yield Preset_1.AskPreset(cmd);
        // =================================
        // Get boilerplate URL
        yield Boilerplate_1.FindBoilerplate(qBoilerplate);
        // =================================
        // Clone git repo
        // Init & validate channel for this new folder
        const git = SimpleGit(currentDir);
        const boilerplatesCount = qBoilerplate.urls.length;
        if (boilerplatesCount > 1) {
            for (const url of qBoilerplate.urls) {
                yield git.clone(url);
            }
            const dirs = GetDirectories(currentDir);
            for (const dir of dirs) {
                Rimraf.sync(Path.join(dir, '.git'));
            }
        }
        else {
            yield git.clone(qBoilerplate.urls[0], currentDir);
            Rimraf.sync(Path.join(currentDir, '.git'));
        }
        // =================================
        // Use only one local project in case of multiple boilerplates
        // If a single boilerplate contains more than one channel, we assume they use the same project
        const projectIsLocal = yield channelsService.mergeLocalProjects();
        // =================================
        // Get project and store info
        if (projectIsLocal) {
            yield Project_1.AskLocalProject(cmd, qProject);
            // Get the the first channel's project and change its name
            const project = (yield channelsService.channels())[0].project;
            project.setNameAndDescription(qProject.name, qProject.description);
            yield project.save();
        }
        else {
            yield Project_1.AskRemoteProject(cmd, qProject);
            yield channelsService.changeRemoteProject(qProject.id);
        }
        // =================================
        // Get models and apply presets if necessary
        yield Preset_1.ApplyPreset(qPresets);
        logger.success(`Created ${boilerplatesCount} new dynamic boilerplate${boilerplatesCount > 1 ? 's' : ''} in ${helpers_1.cPath(currentDir)}.
Run ${helpers_1.cMedium('hpf use')} to connect a remote project (optional).
Run ${helpers_1.cHigh('hpf serve')} to edit models and templates.
Run ${helpers_1.cImportant('hpf generate')} to generate the source code.`);
        // Action Ends
        // ---------------------------------
    });
}
exports.NewCommand = NewCommand;
//# sourceMappingURL=New.js.map