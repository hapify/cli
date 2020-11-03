"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ExportCommand = void 0;
const Path = __importStar(require("path"));
const typedi_1 = require("typedi");
const helpers_1 = require("./helpers");
const Generator_1 = require("../service/Generator");
const Options_1 = require("../service/Options");
const Logger_1 = require("../service/Logger");
const Writer_1 = require("../service/Writer");
const Channel_1 = require("../class/Channel");
function ExportCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get services
        const generator = typedi_1.Container.get(Generator_1.GeneratorService);
        const options = typedi_1.Container.get(Options_1.OptionsService);
        const logger = typedi_1.Container.get(Logger_1.LoggerService);
        const writer = typedi_1.Container.get(Writer_1.WriterService);
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        const channel = new Channel_1.Channel(options.dir());
        yield channel.load();
        helpers_1.logChannel(channel);
        const outputPath = options.output() || Path.join(options.dir(), `${channel.name}.zip`);
        const results = yield generator.runChannel(channel);
        yield writer.zip(outputPath, results);
        logger.success(`Generated and zipped ${helpers_1.cHigh(`${results.length} files`)} for channel ${helpers_1.cChannel(channel.name)} to ${helpers_1.cPath(outputPath)}`);
        // Action Ends
        // ---------------------------------
    });
}
exports.ExportCommand = ExportCommand;
//# sourceMappingURL=Export.js.map