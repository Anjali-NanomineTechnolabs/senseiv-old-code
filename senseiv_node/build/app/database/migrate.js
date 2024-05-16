"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('Are you sure you want to migrate the database? (y/n) ', (answer) => {
    if (!['y', 'Y', 'Yes', 'yes'].includes(answer)) {
        console.error('Migration aborted');
        process.exit(0);
    }
    (async () => {
        const modelsDir = __dirname + '/../models';
        const models = fs
            .readdirSync(modelsDir)
            .filter((file) => file.slice(-3) === '.ts');
        for (const model of models) {
            const modelPath = path.join(modelsDir, model);
            const modelModule = await Promise.resolve(`${modelPath}`).then(s => __importStar(require(s)));
            const modelClass = modelModule.default;
            if (modelClass.sync) {
                await modelClass.sync({ alter: true });
            }
        }
        console.log('Migration completed successfully');
        process.exit(0);
    })();
});
