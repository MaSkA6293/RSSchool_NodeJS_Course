/* eslint-disable no-console */
import http from 'http';
import * as createUrl from 'url';
import * as dotenv from 'dotenv';
import cluster, { Worker } from 'cluster';
import { cpus, EOL } from 'os';
import process from 'node:process';
import { IPidToPort, IUser } from './types';
import dataBase from './database';
import router from './router/router';

dotenv.config();

const numCPUs = cpus().length;
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

if (cluster.isPrimary) {
  const pidToPort: IPidToPort = {};

  let port = 0;

  for (let i = 0; i < numCPUs; i += 1) {
    port = PORT + 1 + i;

    const worker: Worker = cluster.fork({ PORT: port });

    pidToPort[worker.process.pid as keyof IPidToPort] = port;

    worker.on('message', async (msg) => {
      const { message }: { message: string } = JSON.parse(msg);

      if (message === 'getAllUsers') {
        const users: IUser[] = await dataBase.getUsers();
        worker.send(JSON.stringify({ message: 'users', users }));
        return;
      }
      if (message === 'createUser') {
        const { user }: { user: IUser } = JSON.parse(msg);
        dataBase.addUser(user);
        return;
      }
      if (message === 'getUserById') {
        const { userId }: { userId: string } = JSON.parse(msg);
        const user = await dataBase.getUserById(userId);
        worker.send(
          JSON.stringify({
            message: `user is ${user ? '' : 'not '}found`,
            user,
          })
        );
      }
      if (message === 'deleteUser') {
        const { userId }: { userId: string } = JSON.parse(msg);
        const isSuccess = await dataBase.deleteUser(userId);
        worker.send(
          JSON.stringify({
            message: `user was ${isSuccess ? '' : 'not '}removed`,
            result: isSuccess,
          })
        );
      }
      if (message === 'modifyUser') {
        const { user }: { user: IUser } = JSON.parse(msg);
        await dataBase.modifyUser(user);
        worker.send(
          JSON.stringify({
            message: `user was modified`,
            result: true,
          })
        );
      }
    });
  }

  let activeWorker = PORT + 1;

  const loadBalancer: http.Server = http.createServer(
    async (req: http.IncomingMessage, res: http.ServerResponse) => {
      const values = Object.entries(pidToPort);

      const activePid = values.find((el) => el[1] === activeWorker);

      if (activePid) {
        const workerLink = cluster!.workers![activeWorker.toString().slice(-1)];

        if (workerLink) {
          const { method } = req;

          let body = '';
          req
            .on('data', (chunk) => {
              body += chunk;
            })
            .on('end', async () => {
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
                      res.statusCode = workerResponse.statusCode
                        ? workerResponse.statusCode
                        : 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(data);
                    })

                    .on('error', (err) => {
                      console.log('Error: ', err.message);
                    });
                }
              );
              requestToActiveWorker.write(body);
              requestToActiveWorker.end();

              if (activeWorker === PORT + numCPUs) {
                activeWorker = PORT + 1;
              } else {
                activeWorker += 1;
              }
            });
        }
      }
    }
  );

  loadBalancer.listen(process.env.PORT, () => {
    process.stdout.write(
      `Load balancer is running on port: ${process.env.PORT}${EOL}`
    );
  });
} else {
  const app: http.Server = http.createServer(
    (req: http.IncomingMessage, res: http.ServerResponse) => {
      console.log(process.env.PORT, 'have got a request');
      router(req, res);
    }
  );

  app.listen(process.env.PORT, () => {
    process.stdout.write(
      `Worker has been started on port:${process.env.PORT}${EOL}`
    );
  });
}
