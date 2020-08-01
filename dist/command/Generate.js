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
exports.GenerateCommand = void 0;
const typedi_1 = require("typedi");
const helpers_1 = require("./helpers");
const Generator_1 = require("../service/Generator");
const Logger_1 = require("../service/Logger");
const Options_1 = require("../service/Options");
const Writer_1 = require("../service/Writer");
const Channels_1 = require("../service/Channels");
// ############################################
// Get services
const generator = typedi_1.Container.get(Generator_1.GeneratorService);
const options = typedi_1.Container.get(Options_1.OptionsService);
const logger = typedi_1.Container.get(Logger_1.LoggerService);
const writer = typedi_1.Container.get(Writer_1.WriterService);
const channelsService = typedi_1.Container.get(Channels_1.ChannelsService);
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