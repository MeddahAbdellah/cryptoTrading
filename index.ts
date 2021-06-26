import express from 'express';
import bodyParser from 'body-parser';
import socketService from 'services/socket.serivce';
import LoggerService from 'services/logger.service';
import config from 'config';

const app = express();

socketService.initializeSockets(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');
  next();
});

app.get('/', (req, res) => res.send('Server is up!'));

app.listen(config.port, () => LoggerService.log('Server Listening'));