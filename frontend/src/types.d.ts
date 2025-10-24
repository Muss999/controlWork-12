export interface IUserRegister {
  username: string;
  password: string;
  avatar: string | null;
  displayName: string;
  email: string;
}
export interface IUserLogin {
  username: string;
  password: string;
}
export interface IUser {
  _id: string;
  username: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  email: string;
  avatar: string | null;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      message: string;
      name: string;
    };
    message: string;
    name: string;
    _message: string;
  };
}
export interface GlobalError {
  error: string;
}
