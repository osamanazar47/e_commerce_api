import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';
import connectDB from './utils/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/', routes);

connectDB();

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;
export { app };
