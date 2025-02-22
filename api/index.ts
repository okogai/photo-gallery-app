import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import mongoDb from "./mongoDb";
import config from "./config";
import usersRouter from "./routers/users";

const app = express();
const port = config.port;

app.use(cors());
app.use(express.json());
app.use('/public', express.static(config.publicPath));

app.use('/users', usersRouter);

const run = async () => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    process.on('exit', () => {
        mongoDb.disconnect();
    });
};

run().catch(err => console.log(err));


