import { readFile } from 'fs';
import * as http from 'http';

const httpServer = http.createServer((req, res) => {
  const filePath = `${__dirname}${
    req.url === '/' ? '/front/index.html' : `/front${req.url}`
  }`;
  readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

export default httpServer;
