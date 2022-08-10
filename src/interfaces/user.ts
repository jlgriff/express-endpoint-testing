export interface User {
  id: number;
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
