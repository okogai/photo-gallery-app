import express from 'express';
import User from '../models/User';
import { Error } from 'mongoose';
import auth, {RequestWithUser} from "../middleware/auth";
import {OAuth2Client} from "google-auth-library";
import config from "../config";
import {imagesUpload} from "../multer";

const usersRouter = express.Router();

const client = new OAuth2Client(config.google.clientId);

usersRouter.post("/google", async (req, res, next) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            res.status(400).send({ error: "Google login error!" });
            return;
        }

        const email = payload["email"];
        const id = payload["sub"];
        const displayName = payload["name"];
        const avatar = payload["picture"];

        if (!email) {
            res.status(400).send({ error: "Not enough user data to continue" });
            return;
        }
        let user = await User.findOne({ email: email });

        if (!user) {
            const newPassword =  crypto.randomUUID();
            user = new User({
                email: email,
                password: newPassword,
                confirmPassword: newPassword,
                googleID: id,
                displayName,
                avatar
            });
        }

        user.generateToken();
        user.googleID = id;

        await user.save();

        res.send({ message: "Login with Google successful!", user });

    } catch (e) {
        next(e);
    }
});

usersRouter.post('/facebook', async (req, res, next) => {
    try {
        const {accessToken, userID} = req.body;
        if (!accessToken && !userID) {
            res.status(400).send({error: "Access token and userId must be in req"});
            return;
        }

        const url = `https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${accessToken}`;
        const response = await fetch(url);

        if (!response.ok) {
            res.status(400).send({error: "Invalid Facebook user data"});
            return;
        }

        const fbData = await response.json();

        if (!fbData || fbData.id !== userID) {
            res.status(400).send({error: "Invalid Facebook ID"});
            return;
        }

        const facebookID = fbData.id;

        let user = await User.findOne({email: fbData.email});

        if (!user) {
            const newPassword = crypto.randomUUID();
            user = new User({
                email: fbData.email,
                password: newPassword,
                confirmPassword: newPassword,
                displayName: fbData.name,
                facebookID,
            });
        }

        user.generateToken();
        user.facebookID = facebookID;
        await user.save();
        res.send({message: 'Login with facebook success!', user});
    } catch (e) {
        next(e);
    }
});

usersRouter.post('/register', imagesUpload.single('avatar'), async (req, res, next) => {
    const avatar = req.file ? `public/images/${req.file.filename}` : null;
    const {email, password, confirmPassword, displayName} = req.body;
    try {
        const user = new User({email, password, confirmPassword, displayName, avatar});

        user.generateToken();

        await user.save();
        res.send({message: 'Successfully registered', user});
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
        }
        next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            res.status(400).send({error: 'User not found'});
            return;
        }

        const isMatch = await user.checkPassword(req.body.password);

        user.generateToken();
        await user.save();

        if (!isMatch) {
            res.status(400).send({error: 'Password is wrong'});
            return;
        }
        res.send({message: 'Email and password is correct', user});
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
        }
        next(error);
    }
});

usersRouter.delete('/sessions', auth, async (req, res, next) => {
    let reqWithAuth = req as RequestWithUser;
    const userFromAuth = reqWithAuth.user;

    if (!userFromAuth){
        res.status(401).send({error: 'Token not provided!'});
        return;
    }

    try {
        const user = await User.findOne({_id: userFromAuth._id});
        if (user) {
            user.generateToken();
            await user.save();
            res.send({message: 'Success logout'})
        }
    } catch (e){
        next(e);
    }
});

export default usersRouter;