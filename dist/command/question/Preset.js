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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.ApplyPreset = exports.AskPreset = void 0;
const Inquirer = __importStar(require("inquirer"));
const typedi_1 = require("typedi");
const service_1 = require("../../service");
function AskPreset(cmd) {
    return __awaiter(this, void 0, void 0, function* () {
        const presetsCollection = yield typedi_1.Container.get(service_1.PresetsService).collection();
        let qPresets = [];
        if (cmd.preset && cmd.preset.length) {
            qPresets = cmd.preset;
        }
        else {
            // Get presets from remote
            const list = (yield presetsCollection.list()).map(p => ({
                name: p.name,
                value: p.id
            }));
            qPresets = (yield Inquirer.prompt([
                {
                    name: 'presets',
                    message: 'Choose some presets to preload in your project',
                    type: 'checkbox',
                    choices: list,
                    when: () => list.length > 0
                }
            ])).presets;
        }
        return qPresets;
    });
}
exports.AskPreset = AskPreset;
function ApplyPreset(qPresets) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = typedi_1.Container.get(service_1.LoggerService);
        const presets = typedi_1.Container.get(service_1.PresetsService);
        const presetsCollection = yield presets.collection();
        const modelsCollection = yield typedi_1.Container.get(service_1.ChannelsService).modelsCollection();
        if (qPresets && qPresets.length) {
            const models = yield modelsCollection.list();
            // If the project already has models, ignore add presets
            if (models.length) {
                logger.warning('Project already contains models. Ignore presets import.');
            }
            else {
                // Get and apply presets
                for (const id of qPresets) {
                    const preset = yield presetsCollection.get(id);
                    const results = yield presets.apply(preset.models);
                    yield modelsCollection.add(results.created);
                    yield modelsCollection.update(results.updated);
                }
                // Save models
                yield modelsCollection.save();
            }
        }
    });
}
exports.ApplyPreset = ApplyPreset;
//# sourceMappingURL=Preset.js.map