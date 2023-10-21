import express from 'express';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.router';

const PORT = process.env.PORT || 3001;

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRouter);

console.log(app);

app.get('/', (_, res) => {
  res.send('dinamo');
});

const start = async () => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
};

start();
