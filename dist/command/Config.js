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
exports.ConfigCommand = void 0;
const typedi_1 = require("typedi");
const GlobalConfig_1 = require("../service/GlobalConfig");
const Options_1 = require("../service/Options");
const Logger_1 = require("../service/Logger");
function ConfigCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get services
        const globalConfig = typedi_1.Container.get(GlobalConfig_1.GlobalConfigService);
        const options = typedi_1.Container.get(Options_1.OptionsService);
        const logger = typedi_1.Container.get(Logger_1.LoggerService);
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        // Get actual values
        const data = globalConfig.getData();
        const updates = [];
        // Update values
        if (cmd.apiKey) {
            data.apiKey = cmd.apiKey;
            updates.push('apiKey');
        }
        if (cmd.apiUrl) {
            data.apiUrl = cmd.apiUrl;
            updates.push('apiUrl');
        }
        // Store values
        globalConfig.setData(data);
        if (updates.length) {
            logger.success(`Did update global configuration: ${updates.join(', ')}`);
        }
        else {
            logger.warning(`Nothing updated`);
        }
        // Action Ends
        // ---------------------------------
    });
}
exports.ConfigCommand = ConfigCommand;
//# sourceMappingURL=Config.js.map