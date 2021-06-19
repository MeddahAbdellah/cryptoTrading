import express from 'express';
import bodyParser from 'body-parser';
import socketService from 'services/socket.serivce';
import LoggerService from 'services/logger.service';

const PORT = 8080;
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

app.listen(PORT, () => LoggerService.log('Server Listening'));