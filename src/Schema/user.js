export const typeDefs =  [`
      type Query {
        getuser(_id: String): User
        login(Username: String , Password: String): User
        CheckUser(Username:String): User
      }

      type User {
        _id: String
        Username: String
        Password: String
        Name: String 
        BirthDate: String 
        Age: Int
      }

      type Mutation {
        register(Username: String! , Password: String! , Name: String! , BirthData: String! , Age:Int!): User
      }

      schema {
        query: Query
        mutation: Mutation
      }
    `];