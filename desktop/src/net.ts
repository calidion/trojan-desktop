import { createServer, Server } from "net";
import { readFile } from "fs";
import { promisify } from "util";

const asyncReadFile = promisify(readFile);

export async function isPortTaken(port): Promise<boolean> {
  const server: Server = createServer();

  return new Promise((resolve, reject) => {
    server.once("error", function (err: any) {
      if (err.code === "EADDRINUSE") {
        return resolve(true);
      }
      reject(err);
    });

    server.once("close", () => {
      resolve(false);
    });
    server.once("listening", () => {
      server.close();
    });
    server.listen(port);
  });
}

export async function isConfigPortTaken(file): Promise<boolean> {
  const json: any = await asyncReadFile(file);
  return isPortTaken(json.local_port);
}
