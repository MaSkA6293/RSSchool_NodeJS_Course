/* eslint-disable no-console */
import http from 'http';
import * as createUrl from 'url';
import * as dotenv from 'dotenv';
import cluster, { Worker } from 'node:cluster';
import { cpus, EOL } from 'node:os';
import process from 'node:process';
import { IUserCreate, IPidToPort } from './types';
import Db from './database/database';

dotenv.config();

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  const pidToPort: IPidToPort = {};

  let worker: Worker;
  let port = 0;

  for (let i = 0; i < numCPUs; i += 1) {
    port = 4001 + i;

    worker = cluster.fork({ PORT: port });
    pidToPort[worker.process.pid as keyof IPidToPort] = port;
  }

  // cluster.on('exit', () => {
  //   console.log(
  //     `worker ${worker.process.pid} on port ${
  //       pidToPort[worker.process.pid as keyof IPidToPort]
  //     } died`
  //   );

  //   cluster.fork({ PORT: pidToPort[worker.process.pid as keyof IPidToPort] });
  // });

  cluster.on('message', (msg) => {
    console.log(
      `message from worker ${worker.process.pid} on port ${
        pidToPort[worker.process.pid as keyof IPidToPort]
      } ${JSON.stringify(msg)}`
    );
  });

  let activeWorker = 4001;

  const appMain: http.Server = http.createServer(
    async (req: http.IncomingMessage, res: http.ServerResponse) => {
      const values = Object.entries(pidToPort);

      const db: Db = new Db();

      const activePid = values.find((el) => el[1] === activeWorker);

      if (activePid) {
        const workerLink = cluster!.workers![activeWorker.toString().slice(-1)];

        if (workerLink) {
          const { method } = req;

          const body: string[] = [];
          req
            .on('data', (chunk) => {
              body.push(chunk);
            })
            .on('end', async () => {
              const jsonBody: IUserCreate =
                body.length > 0 ? await JSON.parse(body.toString()) : [];

              const requestUrl = req.url ? req.url : '';

              const { path } = createUrl.parse(requestUrl, true);

              const options = {
                host: 'localhost',
                path,
                method,
                headers: {
                  'Content-Type': 'application/json',
                },
                port: activeWorker,
              };

              const requestToActiveWorker = http.request(
                options,
                (workerResponse) => {
                  let data = '';

                  workerResponse.on('data', (chunk) => {
                    data += chunk;
                  });

                  workerResponse
                    .on('end', () => {
                      console.log('Body: ', data);
                      res.statusCode = workerResponse.statusCode
                        ? workerResponse.statusCode
                        : 200;
                      res.end(data);
                    })

                    .on('error', (err) => {
                      console.log('Error: ', err.message);
                    });
                }
              );
              requestToActiveWorker.write(JSON.stringify(jsonBody));
              requestToActiveWorker.end();
            });
        }
      }
      if (activeWorker === 4004) {
        activeWorker = 4001;
      } else {
        activeWorker += 1;
      }
    }
  );

  appMain.listen(4000, () => {
    process.stdout.write(`Main server has been started on port: 4000${EOL}`);
  });
} else {
  const app: http.Server = http.createServer(
    (req: http.IncomingMessage, res: http.ServerResponse) => {
      console.log(process.env.PORT, 'have got a request');
    }
  );

  app.listen(process.env.PORT, () => {
    process.stdout.write(
      `Worker has been started on port:${process.env.PORT}${EOL}`
    );
  });
}
