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
