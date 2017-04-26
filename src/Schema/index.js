export const typeDefs =  [`
      

      type User {
        _id: String
        Username: String
        Password: String
        Name: String
        Image: String 
        BirthDate: String 
        Age: Int
      }

      type Category{
        _id: String
        Name: String 
        Image: String 
      }

      type UnitCategory{
        CategoryName: String
        Name: String
        Image: String 
      }



      type Query {
        getuser(_id: String): User
        login(Username: String , Password: String): User
        CheckUsername(Username:String): User
        listCategory(): Category
        listUnitCategory(CategoryName: String): 
      }

      type Mutation {
        register(Username: String! , Password: String! , Name: String! , BirthData: String! , Age:Int!): User
      }
      schema {
        query: Query
        mutation: Mutation
      }
    `];