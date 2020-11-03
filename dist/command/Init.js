"use strict";
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
exports.InitCommand = void 0;
const typedi_1 = require("typedi");
const helpers_1 = require("./helpers");
const Logger_1 = require("../service/Logger");
const Options_1 = require("../service/Options");
const Channel_1 = require("./question/Channel");
const Channel_2 = require("../class/Channel");
const Project_1 = require("../class/Project");
const Project_2 = require("./question/Project");
function InitCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get services
        const options = typedi_1.Container.get(Options_1.OptionsService);
        const logger = typedi_1.Container.get(Logger_1.LoggerService);
        options.setCommand(cmd);
        const qProject = {};
        const qChannelDescription = {};
        // =================================
        // Get project
        yield Project_2.AskLocalProject(cmd, qProject);
        // =================================
        // Describe channel
        yield Channel_1.DescribeChannel(cmd, qChannelDescription);
        // =================================
        // Init channel to save
        const channel = yield Channel_2.Channel.create(options.dir(), qChannelDescription.name, qChannelDescription.description, qChannelDescription.logo);
        // =================================
        // Create project from channel and save
        yield Project_1.Project.createLocalForChannel(channel, qProject.name, qProject.description);
        yield channel.save();
        logger.success(`Initialized a channel in ${helpers_1.cPath(options.dir())}.
Run ${helpers_1.cMedium('hpf use')} to connect a remote project (optional)`);
        // Action Ends
        // ---------------------------------
    });
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=Init.js.map