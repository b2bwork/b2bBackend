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
        _id: String
        CategoryName: String
        Name: String
        Image: String 
      }

      type Review{
        _id: String
        Workid: String
        ReviewerName: String
        Reviewdata: String
        Star : number
      }

      type DetailReview{
        _id: String
        ReviewerName: String
        Reviewdata: String
        Start: number
        Image: [ImageReview]
      }

      type ImageReview{
        ReviewId: String 
        PathImage: String 
        
      }

      type Query {
        getuser(_id: String): User
        login(Username: String , Password: String): User
        CheckUsername(Username:String): User
        listCategory(): Category
        listUnitCategory(Name: String): UnitCategory
        listReview(): Review
        listUnitReview(): DetailReview
      }

      type Mutation {
        register(Username: String! , Password: String! , Name: String! , BirthData: String! , Age:Int!): User
      }
      schema {
        query: Query
        mutation: Mutation
      }
    `];