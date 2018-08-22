#!/usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Commander = __importStar(require("commander"));
const chalk_1 = __importDefault(require("chalk"));
const class_1 = require("./class");
const typedi_1 = require("typedi");
const Generator_1 = require("./service/Generator");
const commander = Commander.default;
commander
    .version('0.1.0')
    .description('Hapify Command Line Tool');
commander
    .command('start')
    .alias('s')
    .description('Start console for current directory')
    .action(() => __awaiter(this, void 0, void 0, function* () {
    console.log(chalk_1.default.magentaBright('Loaded'));
    const channel = new class_1.Channel('tests/hapijs');
    yield channel.load();
    const generator = typedi_1.Container.get(Generator_1.GeneratorService);
    yield generator.compile(channel, channel.templates[0]);
}));
// If no arguments, show help
if (!process.argv.slice(2).length) {
    commander.outputHelp();
    process.exit();
}
commander.parse(process.argv);
//# sourceMappingURL=index.js.map