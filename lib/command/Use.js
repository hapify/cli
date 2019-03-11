"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const service_1 = require("../service");
const helpers_1 = require("./helpers");
const question_1 = require("./question");
// ############################################
// Get services
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
const channelsService = typedi_1.Container.get(service_1.ChannelsService);
function UseCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            options.setCommand(cmd);
            // ---------------------------------
            // Action starts
            const qProject = {};
            // =================================
            // Get project
            yield question_1.AskProject(cmd, qProject);
            // =================================
            // Create project if necessary
            yield question_1.SetupProject(qProject);
            // =================================
            // Set project in channel and save
            yield channelsService.changeProject(qProject.id);
            // =================================
            // Log changes
            const channels = yield channelsService.channels();
            for (const channel of channels) {
                logger.success(`Did set project ${helpers_1.cHigh(qProject.id)} for channel ${helpers_1.cChannel(channel.name)}`);
            }
            // Action Ends
            // ---------------------------------
            logger.time();
        }
        catch (error) {
            logger.handle(error);
        }
    });
}
exports.UseCommand = UseCommand;
//# sourceMappingURL=Use.js.map