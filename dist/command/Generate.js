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
// ############################################
// Get services
const generator = typedi_1.Container.get(service_1.GeneratorService);
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
const writer = typedi_1.Container.get(service_1.WriterService);
const channelsService = typedi_1.Container.get(service_1.ChannelsService);
function GenerateCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            options.setCommand(cmd);
            // ---------------------------------
            // Action starts
            const channels = yield channelsService.channels();
            for (const channel of channels) {
                helpers_1.logChannel(channel);
            }
            for (const channel of channels) {
                const results = yield generator.runChannel(channel);
                yield writer.writeMany(channel.path, results);
                logger.success(`Generated ${helpers_1.cHigh(`${results.length} files`)} for channel ${helpers_1.cChannel(channel.name)}`);
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
exports.GenerateCommand = GenerateCommand;
//# sourceMappingURL=Generate.js.map