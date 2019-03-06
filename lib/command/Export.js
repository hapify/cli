"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = __importStar(require("path"));
const class_1 = require("../class");
const typedi_1 = require("typedi");
const service_1 = require("../service");
const helpers_1 = require("./helpers");
// ############################################
// Get services
const generator = typedi_1.Container.get(service_1.GeneratorService);
const options = typedi_1.Container.get(service_1.OptionsService);
const logger = typedi_1.Container.get(service_1.LoggerService);
const writer = typedi_1.Container.get(service_1.WriterService);
function ExportCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            options.setCommand(cmd);
            // ---------------------------------
            // Action starts
            const channel = new class_1.Channel(options.dir());
            yield channel.load();
            helpers_1.logChannel(channel);
            const outputPath = options.output() || Path.join(options.dir(), `${channel.name}.zip`);
            const results = yield generator.runChannel(channel);
            yield writer.zip(outputPath, results);
            logger.success(`Generated and zipped ${helpers_1.cHigh(`${results.length} files`)} for channel ${helpers_1.cChannel(channel.name)} to ${helpers_1.cPath(outputPath)}`);
            // Action Ends
            // ---------------------------------
            logger.time();
        }
        catch (error) {
            logger.handle(error);
        }
    });
}
exports.ExportCommand = ExportCommand;
//# sourceMappingURL=Export.js.map