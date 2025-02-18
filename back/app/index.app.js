import express from 'express';
import router from './routers/index.router.js';
import cors from 'cors';
import path from 'path';

const __dirname = path.resolve();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://51.20.37.180',
    'http://attribute-control.merchtools.me',
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../front/dist')));

app.set('views', 'public/views');
app.set('view engine', 'ejs');

app.use(router);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/dist', 'index.html'));
});

export default app;
