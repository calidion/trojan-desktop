import { createServer, Server } from "net";

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
