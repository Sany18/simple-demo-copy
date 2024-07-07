require('dotenv').config({ path: './.env' });

const express = require('express');
const path = require('path');
const http = require('http');
const webSocketServer = require('ws').Server;
const app = new express();
const fs = require('fs');

const dist = path.join(__dirname, '..', '/_dist');
const root = path.join(__dirname, '..');
const PORT = process.env.BE_PORT || 3999;
const FE_PORT = process.env.FE_PORT || 3000;
const currentEnv = process.env.NODE_ENV || 'development';

console.info('===============================');
console.info(`env: ${currentEnv}`);
console.info(`FE/BE: http://localhost:${PORT}`);
console.info('===============================');
console.info();
console.info('====== routes ======');

app.all('*', (req, res, next) => {
  if (req.method !== 'HEAD') logger(req);
  next();
});

/**************
 *     1      *
 * 3d-shooter *
 **************/
const games1 = '3d-shooter';
console.info('route', `/${games1}*`);

// app.use(`/${games1}/api`, require(`../game1-${games1}/`));

app.get(`/${games1}*`, (req, res) => {
  const gameLocalPath = path.join(dist, `/${games1}`);
  const urlPath = decodeURI(req.url.replace(`/${games1}`, ''));

  if (urlPath == '/' || !urlPath) {
    return res.sendFile(path.join(gameLocalPath, '/index.html'));
  }

  console.log(gameLocalPath, urlPath);
  res.sendFile(path.join(gameLocalPath, urlPath));
});

/**********
 *   2    *
 * tetris *
 **********/
// This game is not compiled, so it uses original folder path
const games2 = 'tetris';
console.info('route', `/${games2}*`);

app.get(`/${games2}*`, (req, res) => {
  const gameLocalPath = path.join(root, `game2-${games2}`);
  const urlPath = decodeURI(req.url.replace(`/${games2}`, ''));

  if (urlPath == '/' || !urlPath) {
    return res.sendFile(path.join(gameLocalPath, '/index.html'));
  }
  res.sendFile(path.join(gameLocalPath, urlPath));
});

/*************
 *     3     *
 * synthwave *
 *************/
const game = 'synthwave';
const route = `/${game}*`;
console.info('route', route);
app.get(route, (req, res) => {
  const gameLocalPath = path.join(dist, game);
  const urlPath = decodeURI(req.url.replace(`/${game}`, ''));

  if (urlPath == '/' || !urlPath) {
    return res.sendFile(path.join(gameLocalPath, '/index.html'));
  }
  res.sendFile(path.join(gameLocalPath, urlPath));
});

/** */
console.info('route', '/', '-> dist')
app.use(express.static(dist));
app.get('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

console.log('====================');

const httpServer = http.createServer(app);
httpServer.listen(PORT);

const wsServer = new webSocketServer({ server: httpServer });

wsServer.on('connection', ws => {
  ws.on('message', runCommands);
  sendMessageToCurrentUser(ws, JSON.stringify({ __id: ++userId }));
  sendMessageToCurrentUser(ws, 'Welcome. WS is working');
});

function runCommands(message) {
  if (message == 'password') { return httpServer.close() }

  broadcast(message);
};

function wsMessageFormatter(message) { return JSON.stringify({ message, timestamp: new Date() }) };

function broadcast(message) { wsServer.clients.forEach(client => client.send(wsMessageFormatter(message))) };

function sendMessageToCurrentUser(ws, message) { ws.send(wsMessageFormatter(message)) };

///////////////////////
// helpers
///////
function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
}

function logger(req) {
  console.log(
    req.method,
    getIp(req),
    req.url,
    req.query
  );
};
