import mongoose, {HydratedDocument, Model} from 'mongoose';
import bcrypt from 'bcrypt';
import {randomUUID} from "node:crypto";
import {UserFields} from "../types";

type UserModel = Model<UserFields, {}, UserMethods>;

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

interface UserVirtuals {
    confirmPassword: string;
}

const regEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;

const UserSchema = new Schema<
    HydratedDocument<UserFields>,
    UserModel,
    UserMethods,
    {},
    UserVirtuals
>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [
            {
                validator: async function (this: HydratedDocument<UserFields>, email: string): Promise<boolean> {
                    if (!this.isModified('email')) return true;
                    const user: UserFields | null = await User.findOne({email});
                    return !user;
            },
                message: 'This user is already registered',
            },
            {
                validator: async function (this: HydratedDocument<UserFields>, value: string): Promise<boolean> {
                    if (!this.isModified('email')) return true;
                    return regEmail.test(value);
                },
                message: "Invalid email format",
            }
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin']
    },
    token: {
        type: String,
        required: [true, 'Token is required'],
    },
    displayName: {
        type: String,
        required: [true, 'Display name is required'],
    },
    googleID: String,
    facebookID: String,
    avatar: String,
    },
    {
        virtuals: {
            confirmPassword: {
                get() {
                    return this.__confirmPassword
                },
                set(confirmPassword: string) {
                    this.__confirmPassword = confirmPassword;
                }
            }
        },
    }
);

UserSchema.path("password").validate(function (value) {
    if (!this.isModified('password')) return;

    if (value !== this.confirmPassword) {
        this.invalidate('password', 'Passwords do not match');
        this.invalidate('confirmPassword', 'Passwords do not match');
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.checkPassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};
UserSchema.methods.generateToken = function () {
    this.token = randomUUID();
};

UserSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('User', UserSchema);
export default User;