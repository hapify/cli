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
exports.ListCommand = void 0;
const typedi_1 = require("typedi");
const helpers_1 = require("./helpers");
const Options_1 = require("../service/Options");
const Logger_1 = require("../service/Logger");
const Channels_1 = require("../service/Channels");
function ListCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get services
        const options = typedi_1.Container.get(Options_1.OptionsService);
        const logger = typedi_1.Container.get(Logger_1.LoggerService);
        const channelsService = typedi_1.Container.get(Channels_1.ChannelsService);
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        const channels = yield channelsService.channels();
        for (const channel of channels) {
            helpers_1.logChannel(channel);
        }
        // Group channels by models collections
        const modelsCollections = {};
        for (const channel of channels) {
            if (typeof modelsCollections[channel.modelsCollection.path] === 'undefined') {
                modelsCollections[channel.modelsCollection.path] = [];
            }
            modelsCollections[channel.modelsCollection.path].push(channel);
        }
        const modelsPaths = Object.keys(modelsCollections);
        for (const modelsPath of modelsPaths) {
            const c = modelsCollections[modelsPath];
            const mc = c.length > 1;
            const m = yield c[0].modelsCollection.list();
            const mm = m.length > 1;
            let message = `Channel${mc ? 's' : ''} ${c.map((c) => helpers_1.cChannel(c.name)).join(', ')} use${mc ? '' : 's'} models of ${helpers_1.cPath(modelsPath)}`;
            if (m.length === 0) {
                message += `\nThere is no model yet.`;
            }
            else {
                message += `\nThe model${mm ? 's are' : ' is'}:\n- ${m.map((m) => helpers_1.cModel(m.name)).join('\n- ')}`;
            }
            logger.newLine().info(message);
        }
        logger.newLine();
        // Action Ends
        // ---------------------------------
    });
}
exports.ListCommand = ListCommand;
//# sourceMappingURL=List.js.map