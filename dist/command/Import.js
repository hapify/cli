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
exports.ImportCommand = void 0;
const typedi_1 = require("typedi");
const Options_1 = require("../service/Options");
const Channels_1 = require("../service/Channels");
const Logger_1 = require("../service/Logger");
const Preset_1 = require("./question/Preset");
function ImportCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get services
        const options = typedi_1.Container.get(Options_1.OptionsService);
        const logger = typedi_1.Container.get(Logger_1.LoggerService);
        const channelsService = typedi_1.Container.get(Channels_1.ChannelsService);
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        yield channelsService.ensureSameProject();
        yield channelsService.ensureSameDefaultFields();
        // =================================
        // Get presets
        const qPresets = yield Preset_1.AskPreset(cmd);
        // =================================
        // Get models and apply presets if necessary
        const success = yield Preset_1.ApplyPreset(qPresets);
        if (success) {
            logger.success(`Did apply ${qPresets.length} preset(s)`);
        }
        else {
            logger.error('Operation aborted');
        }
        // Action Ends
        // ---------------------------------
    });
}
exports.ImportCommand = ImportCommand;
//# sourceMappingURL=Import.js.map