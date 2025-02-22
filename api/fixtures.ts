import mongoose from "mongoose";
import crypto from "crypto";
import User from "./models/User";
import Image from "./models/Image";

const run = async () => {
    await mongoose.connect('mongodb://localhost/gallery');
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('images');
    } catch (e) {
        console.log('Collections were not present, skipping drop');
    }

    const [john, admin, jane] = await User.create([
        {
            email: 'john@example.com',
            password: '123',
            token: crypto.randomUUID(),
            role: 'user',
            avatar: 'public/fixtures/john.jpg',
            displayName: 'John',
            confirmPassword: '123',
        },
        {
            email: 'admin@example.com',
            password: '123',
            token: crypto.randomUUID(),
            role: 'admin',
            avatar: 'public/fixtures/admin.jpg',
            displayName: 'Admin',
            confirmPassword: '123',
        },
        {
            email: 'jane@example.com',
            password: '123',
            token: crypto.randomUUID(),
            role: 'user',
            avatar: 'public/fixtures/jane.jpg',
            displayName: 'Jane',
            confirmPassword: '123',
        },
    ]);

    await Image.create([
        {
            user: john._id,
            title: 'John Image 1',
            image: 'public/fixtures/john_image1.jpeg',
        },
        {
            user: john._id,
            title: 'John Image 2',
            image: 'public/fixtures/john_image2.jpeg',
        },
        {
            user: john._id,
            title: 'John Image 3',
            image: 'public/fixtures/john_image3.jpeg',
        },
        {
            user: john._id,
            title: 'John Image 4',
            image: 'public/fixtures/john_image4.jpeg',
        },
        {
            user: admin._id,
            title: 'Admin Image 1',
            image: 'public/fixtures/admin_image1.jpeg',
        },
        {
            user: admin._id,
            title: 'Admin Image 2',
            image: 'public/fixtures/admin_image2.jpeg',
        },
        {
            user: admin._id,
            title: 'Admin Image 3',
            image: 'public/fixtures/admin_image3.jpeg',
        },
        {
            user: admin._id,
            title: 'Admin Image 4',
            image: 'public/fixtures/admin_image4.jpeg',
        },
        {
            user: jane._id,
            title: 'Jane Image 1',
            image: 'public/fixtures/jane_image1.jpeg',
        },
        {
            user: jane._id,
            title: 'Jane Image 2',
            image: 'public/fixtures/jane_image2.jpeg',
        },
        {
            user: jane._id,
            title: 'Jane Image 3',
            image: 'public/fixtures/jane_image3.jpeg',
        },
        {
            user: jane._id,
            title: 'Jane Image 4',
            image: 'public/fixtures/jane_image4.jpeg',
        },
    ]);

    console.log('Fixtures added');
    await mongoose.connection.close();
};

run().catch(console.error);
