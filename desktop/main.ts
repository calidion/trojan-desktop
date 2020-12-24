import options from "./src/option";
import { TrojanClientApplication } from './src/app';
const args = process.argv.slice(1);
const serve = args.some((val) => val === "--serve");
const trojan = new TrojanClientApplication(options, serve);

trojan.run();
