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
const Inquirer = __importStar(require("inquirer"));
const child_process_1 = require("child_process");
const util = __importStar(require("util"));
const typedi_1 = require("typedi");
const service_1 = require("../../service");
const options = typedi_1.Container.get(service_1.OptionsService);
function AskDiff(cmd, qDiff, git) {
    return __awaiter(this, void 0, void 0, function* () {
        const branches = yield git.branchLocal();
        qDiff.source = (yield Inquirer.prompt([
            {
                name: 'source',
                message: 'Choose a source branch',
                type: 'list',
                choices: branches.all,
                default: 'hapify'
            }
        ])).source;
        const commits = (yield git.log([qDiff.source, '-n', '20', '--'])).all.map(c => ({ name: `[${c.date}] ${c.message}`, value: c.hash }));
        qDiff.from = (yield Inquirer.prompt([
            {
                name: 'from',
                message: 'Choose the first commit',
                type: 'list',
                choices: [
                    { name: 'Enter a commit hash', value: null },
                    new Inquirer.Separator(),
                    ...commits
                ],
                default: commits.length > 1 ? commits[1].value : null,
                when: () => commits.length > 0
            },
            {
                name: 'from',
                message: 'Enter the first commit hash',
                when: (answer) => !answer.from,
                validate: input => input.length > 0
            }
        ])).from;
        qDiff.to = (yield Inquirer.prompt([
            {
                name: 'to',
                message: 'Choose the second commit',
                type: 'list',
                choices: [
                    { name: 'Enter a commit hash', value: null },
                    new Inquirer.Separator(),
                    ...commits
                ],
                default: commits.length > 0 ? commits[0].value : null,
                when: () => commits.length > 0
            },
            {
                name: 'to',
                message: 'Enter the second commit hash',
                when: (answer) => !answer.to,
                validate: input => input.length > 0
            }
        ])).to;
        qDiff.destination = (yield Inquirer.prompt([
            {
                name: 'destination',
                message: 'Choose a destination branch',
                type: 'list',
                choices: branches.all,
                default: 'develop'
            }
        ])).destination;
    });
}
exports.AskDiff = AskDiff;
function ApplyDiff(qDiff, git) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = `git format-patch --stdout ${qDiff.from}..${qDiff.to} | git am -3 -k`;
        const confirm = (yield Inquirer.prompt([
            {
                name: 'confirm',
                message: `Confirm run command: "${command}" on branch ${qDiff.destination}`,
                type: 'confirm',
                default: false
            }
        ])).confirm;
        if (confirm) {
            yield git.checkout(qDiff.destination);
            const { stdout, stderr } = yield util.promisify(child_process_1.exec)(command, {
                cwd: options.dir()
            });
            if (stderr && stderr.length) {
                throw new Error(`${stderr}\n${stdout}`);
            }
            return stdout;
        }
        return null;
    });
}
exports.ApplyDiff = ApplyDiff;
//# sourceMappingURL=Diff.js.map