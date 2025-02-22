import express from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import {imagesUpload} from "../multer";
import Image from "../models/Image";

const imagesRouter = express.Router();

imagesRouter.get('/', imagesUpload.single('image'), async (_req, res, next) => {
    try {
        const results = await Image.find().populate('user', 'email displayName avatar');
        res.send(results);
    } catch (e) {
        next(e);
    }
});

imagesRouter.post('/', auth, imagesUpload.single('image'), async (req, res, next) => {
    const { title } = req.body;
    const image = req.file ? `public/images/${req.file.filename}` : null;

    const user = (req as RequestWithUser).user;

    if (!user){
        res.status(401).send({error: 'Token not provided!'});
        return;
    }

    if (!title) {
        res.status(400).send({ error: 'Title is required' });
        return;
    }

    if (!image) {
        res.status(400).send({ error: 'Image is required' });
        return;
    }

    try {
        const newImage = new Image({ title, image, user: user._id});
        await newImage.save();
        res.send(newImage);
    } catch (e) {
        next(e);
    }
});

export default imagesRouter;
