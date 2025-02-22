export interface User {
  email: string;
  _id: string;
  token: string;
  role: string;
  displayName: string;
  googleID?: string;
  facebookID?: string;
  avatar: string;
}

export type UserMutation = Omit<User, "token" | "role">

export interface RegisterMutation {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  avatar: File | null;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface GlobalError {
  error: string;
}

export interface Image {
  _id: string;
  title: string;
  image: string;
  user: UserMutation;
}

export interface ImageMutation {
  title: string;
  image: File | null;
}
