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
exports.PatchCommand = void 0;
const typedi_1 = require("typedi");
const Options_1 = require("../service/Options");
const Logger_1 = require("../service/Logger");
const Diff_1 = require("./question/Diff");
const SimpleGit = require('simple-git/promise');
function PatchCommand(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get services
        const options = typedi_1.Container.get(Options_1.OptionsService);
        const logger = typedi_1.Container.get(Logger_1.LoggerService);
        options.setCommand(cmd);
        // ---------------------------------
        // Action starts
        const qDiif = {};
        const currentDir = options.dir();
        // =================================
        // Clone git repo
        const git = SimpleGit(currentDir);
        // =================================
        // Get source and destination
        yield Diff_1.AskDiff(cmd, qDiif, git);
        // =================================
        // Run patch
        const result = yield Diff_1.ApplyDiff(qDiif, git);
        if (result === null) {
            logger.info('Aborted');
        }
        else {
            logger.success(`Success:\n${result}`);
        }
        // Action Ends
        // ---------------------------------
    });
}
exports.PatchCommand = PatchCommand;
//# sourceMappingURL=Patch.js.map