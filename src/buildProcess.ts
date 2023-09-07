import chalk from "chalk";
import { execSync } from "child_process";
import { readdirSync } from "fs";
import { resolve } from "path";
import { askQuestion, readlineInterface } from "./askQuestion";

export async function buildProcess(askToChangeEnvVariables: boolean) {
    if (askToChangeEnvVariables) {
        let files = readdirSync(resolve("./")),
            dotenvExists = false;

        for (let index = 0; index < files.length; index++) {
            if (files[index].startsWith(".env")) {
                dotenvExists = true;
                break;
            }
        }

        if (dotenvExists) {
            let decision = (
                await askQuestion(
                    "\nDo you want to change any environment variable? [ y | n ]: "
                )
            ).toLowerCase();

            while (!["y", "n"].includes(decision))
                decision = (
                    await askQuestion("\nPlease enter 'y' or 'n': ")
                ).toLowerCase();

            if (decision === "y") {
                console.log(
                    "\nPlease re-run previous command, after you change environment variables."
                );
                readlineInterface.close();
                process.exit();
            }
        }
    }

    try {
        console.log("\nRunning NextJS build process...\n");
        let build_output = execSync("npm run build");
        console.log(`\n${build_output.toString()}`);
    } catch (error) {
        console.log(
            `\n${chalk.red(
                "ERROR:"
            )} Make sure to run this command from the root of your NextJS project.`
        );
        readlineInterface.close();
        process.exit();
    }
}