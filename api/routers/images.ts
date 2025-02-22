import express from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import {imagesUpload} from "../multer";
import Image from "../models/Image";

const imagesRouter = express.Router();

imagesRouter.get('/', imagesUpload.single('image'), async (req, res, next) => {
    try {
        if(req.query.user) {
            const results = await Image.find({user: req.query.user}).populate('user', 'email displayName avatar');
            res.send(results);
            return;
        }

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

imagesRouter.delete('/:id', auth, async (req, res, next) => {
    const {id} = req.params;

    const reqWithUser = req as RequestWithUser;

    if (!reqWithUser.user) {
        res.status(401).send({error: 'Token not provided!'});
        return;
    }

    try {
        const image = await Image.findById(id);

        if (!image) {
            res.status(404).json({error: "Image not found"});
            return;
        }

        if (reqWithUser.user.role !== 'admin' && image.user._id.toString() !== reqWithUser.user._id.toString()) {
            res.status(403).json({error: "You have not permissions"});
            return;
        }
        
        await Image.findByIdAndDelete(id);
        res.send({message: "Image deleted"});
    } catch (e) {
        next(e);
    }
});

export default imagesRouter;
