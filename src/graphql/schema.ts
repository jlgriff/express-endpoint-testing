import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type User {
    _id: ID!
    email: String!
    firstname: String!
    lastname: String!
    password: String
  }

  type AuthData {
    token: String!
    userId: String!
  }

  input UserInputData {
    email: String!
    firstname: String!
    lastname: String!
    password: String!
  }

  input AuthInputData {
    email: String!
    password: String!
  }

  type Query {
    login(authInput: AuthInputData!): AuthData!
  }

  type Mutation {
    createUser(userInput: UserInputData): User!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);

export default schema;
