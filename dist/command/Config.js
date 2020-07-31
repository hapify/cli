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
const service_1 = require("../service");
// ############################################
// Get services
const globalConfig = typedi_1.Container.get(service_1.GlobalConfigService);
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
function ConfigCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
            logger.time();
        }
        catch (error) {
            logger.handle(error);
        }
    });
}
exports.ConfigCommand = ConfigCommand;
//# sourceMappingURL=Config.js.map