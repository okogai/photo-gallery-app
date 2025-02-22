import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    image: {
        type: String,
        required: [true, 'Photo is required'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
});

const Image = mongoose.model('Image', ImageSchema);
export default Image;