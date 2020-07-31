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
exports.ServeCommand = void 0;
const typedi_1 = require("typedi");
const service_1 = require("../service");
const helpers_1 = require("./helpers");
// ############################################
// Get services
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
const http = typedi_1.Container.get(service_1.HttpServerService);
const channelsService = typedi_1.Container.get(service_1.ChannelsService);
function ServeCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            options.setCommand(cmd);
            // ---------------------------------
            // Action starts
            yield channelsService.ensureSameProject();
            yield channelsService.ensureSameDefaultFields();
            yield http.serve();
            logger.info(`Server is running at: ${helpers_1.cPath(http.url())}`);
            if (options.open()) {
                http.open();
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
exports.ServeCommand = ServeCommand;
//# sourceMappingURL=Serve.js.map