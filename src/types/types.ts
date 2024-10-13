export type User = {
  id: string;
  name: string;
  role: string;
  username?: string;
};
export type UserWithAccessToken = {
  user: User;
  accessToken: string;
};
