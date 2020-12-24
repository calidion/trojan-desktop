import { createServer, Server } from 'net';

export async function isPortTaken(port: number): Promise<boolean> {
  const server: Server = createServer();

  return new Promise((resolve, reject) => {
    server.once('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        return resolve(true);
      }
      reject(err);
    });

    server.once('close', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close();
    });
    server.listen(port);
  });
}
