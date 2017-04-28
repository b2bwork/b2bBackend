export const typeDefs =  [`
      

      type User {
        _id: String
        Username: String
        Password: String
        Name: String
        Image: String 
        BirthDate: String 
        Age: Int
        Latitude: Float
        Longtitude: Float
        ImageIdCard: String
        VerifyIdCard: Boolean
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
        WorkName: String
        Workid: String
        ReviewerName: String
        Reviewdata: String
        Star : Int
      }

      type DetailReview{
        _id: String
        WorkName: String
        Workid: String
        ReviewerName: String
        Reviewdata: String
        Star: Int
        Image: [String]
      }

      type Works {
        _id :String
        CategoryName: String
        WorkName: String
        WorkerName: String
        ScopeWork: String
        Workdays : Int
        DetailWork: String
        ExperienceWorker: String
        Price: Int
        Queue : Int
        TagWork : [String]

      }

      type ChatMessage {
        UserId1: String
        UserId2: String
        Messages: [String]

      }

      type Qoute {
        CustomerId: String
        CustomerName: String
        FreelanceId: String
        FreelanceName: String
        DealPrice: Int
        DueDate: String
        Approve: Boolean
      }
      type Query {
        getuser(_id: String): User
        login(Username: String , Password: String): User
        CheckUsername(Username:String): User
        listCategory: Category
        listUnitCategory(CategoryName: String): UnitCategory
        listReview(Workid: String): Review
        listDetailReview(_id: String ): DetailReview
        listWorks(CategoryName: String ): Works
      }
      

      type Mutation {
        register(Username: String! , Password: String! , Name: String! , BirthData: String! , Age:Int!): User
        InsertReview(Workid: String! , ReviewerName: String! , Reviewdata: String! , Star: Int! , Image: [String]!): DetailReview
        InsertVerifyIdCard(_id: String , ImageIdCard: String!);
        InsertMessage(UserId1: String! , UserId2: String! , Messages: String!);
        InsertQoute(CustomerId: String , CustomerName: String , FreelanceId: String , FreelanceName: String , DealPrice: Int , DueDate: String): Qoute
      }
      schema {
        query: Query
        mutation: Mutation
      }
    `];