import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question('Are you sure you want to migrate the database? (y/n) ', (answer) => {
    if (!['y', 'Y', 'Yes', 'yes'].includes(answer)) {
        console.error('Migration aborted')
        process.exit(0)
    }

    (async () => {
        const modelsDir = __dirname + '/../models'

        const models = fs
            .readdirSync(modelsDir)
            .filter((file) => file.slice(-3) === '.ts');

        for (const model of models) {
            const modelPath = path.join(modelsDir, model)
            const modelModule = await import(modelPath)
            const modelClass = modelModule.default
            if (modelClass.sync) {
                await modelClass.sync({alter: true})
            }
        }

        console.log('Migration completed successfully')
        process.exit(0);
    })()
})