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
exports.UseCommand = void 0;
const typedi_1 = require("typedi");
const helpers_1 = require("./helpers");
const Options_1 = require("../service/Options");
const Logger_1 = require("../service/Logger");
const Channels_1 = require("../service/Channels");
const Project_1 = require("./question/Project");
function UseCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get services
        const options = typedi_1.Container.get(Options_1.OptionsService);
        const logger = typedi_1.Container.get(Logger_1.LoggerService);
        const channelsService = typedi_1.Container.get(Channels_1.ChannelsService);
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        const qProject = {};
        // =================================
        // Get project
        yield Project_1.AskRemoteProject(cmd, qProject);
        // =================================
        // Create project if necessary
        yield Project_1.SetupRemoteProject(qProject);
        // =================================
        // Set project in channel and save
        yield channelsService.changeRemoteProject(qProject.id);
        // =================================
        // Log changes
        const channels = yield channelsService.channels();
        for (const channel of channels) {
            logger.success(`Did set project ${helpers_1.cHigh(qProject.id)} for channel ${helpers_1.cChannel(channel.name)}`);
        }
        // Action Ends
        // ---------------------------------
    });
}
exports.UseCommand = UseCommand;
//# sourceMappingURL=Use.js.map