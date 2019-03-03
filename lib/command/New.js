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
const Fs = __importStar(require("fs"));
const question_1 = require("./question");
const SimpleGit = require('simple-git/promise');
// ############################################
// Get services
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
const channelsService = typedi_1.Container.get(service_1.ChannelsService);
function NewCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
            // Get project
            yield question_1.AskProject(cmd, qProject);
            // =================================
            // Get boilerplate
            yield question_1.AskBoilerplate(cmd, qBoilerplate);
            // =================================
            // Get presets
            const qPresets = yield question_1.AskPreset(cmd);
            // =================================
            // Create project if necessary
            yield question_1.SetupProject(qProject);
            // =================================
            // Get boilerplate URL
            yield question_1.FindBoilerplate(qBoilerplate);
            // =================================
            // Clone git repo
            const git = SimpleGit(currentDir);
            yield git.clone(qBoilerplate.url, currentDir);
            // =================================
            // Init & validate channel for this new folder
            yield channelsService.changeProject(qProject.id);
            // =================================
            // Get models and apply presets if necessary
            yield question_1.ApplyPreset(qPresets);
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