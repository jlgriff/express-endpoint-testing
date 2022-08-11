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

  type Query {
    login(email: String!, password: String!): AuthData!
  }

  type Mutation {
    createUser(email: String!, firstname: String!, lastname: String!, password: String!): User!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);

export default schema;
