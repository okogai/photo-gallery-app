export interface UserFields {
    email: string;
    password: string;
    token: string;
    role: string;
    displayName?: string;
    googleID?: string;
    facebookID?: string;
    avatar?: string;
    __confirmPassword: string;
}
