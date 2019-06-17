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
function DescribeChannel(cmd, qChannelDescription) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get description from user
        // If the name is passed, bypass all questions
        const answer = (yield Inquirer.prompt([
            {
                name: 'name',
                message: 'Enter the boilerplate name',
                when: () => !cmd.boilerplateName,
                default: null
            },
            {
                name: 'description',
                message: 'Enter a description',
                when: () => !cmd.boilerplateDesc && !cmd.boilerplateName,
                default: null
            },
            {
                name: 'logo',
                message: 'Enter a logo URL',
                when: () => !cmd.boilerplateLogo && !cmd.boilerplateName,
                default: null
            }
        ]));
        qChannelDescription.name = cmd.boilerplateName || answer.name;
        qChannelDescription.description = cmd.boilerplateDesc || answer.description;
        qChannelDescription.logo = cmd.boilerplateLogo || answer.logo;
    });
}
exports.DescribeChannel = DescribeChannel;
//# sourceMappingURL=Channel.js.map