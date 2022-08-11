export interface User {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface UserInput {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}
