export interface IUser {
  username: string;
  password: string;
  token: string;
  displayName: string;
  email: string;
  avatar: string | null;
  googleId?: string;
}
