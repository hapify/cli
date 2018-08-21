#!/usr/bin/env node
"use strict";
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
const Bootstrap_1 = __importDefault(require("./class/Bootstrap"));
const commander = Commander.default;
commander
    .version('0.1.0')
    .description('Hapify Command Line Tool');
commander
    .command('start')
    .alias('s')
    .description('Start console for current directory')
    .action(() => {
    console.log(chalk_1.default.magentaBright('Loaded'));
    const bootstrap = new Bootstrap_1.default('tests/hapijs');
});
// If no arguments, show help
if (!process.argv.slice(2).length) {
    commander.outputHelp();
    process.exit();
}
commander.parse(process.argv);
//# sourceMappingURL=index.js.map