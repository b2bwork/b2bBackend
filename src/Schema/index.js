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
        WorkId: String
        ReviewerName: String
        ReviewerImage: String
        Reviewdata: String
        Star : Int
        Verified: Boolean
      }

      type DetailReview{
        _id: String
        WorkName: String
        WorkId: String
        ReviewerName: String
        ReviewerImage: String
        Reviewdata: String
        Star: Int
        Image: [String]
      }

      type Works {
        _id : String
        CategoryName: String
        WorkName: String
        CoverImage: String
        WorkerName: String
        WorkerId: String
        ScopeWork: String
        Workdays : Int
        DetailWork: String
        ExperienceWorker: String
        Price: Int
        Queue : Int
        Image: [String]
        TagWork : [String]
        Verify: Boolean

      }

      type ChatMessage {
        UserId1: String
        UserId2: String
        Messages: [String]

      }

      type Qoute {
        _id: String
        WorkId: String
        CustomerId: String
        CustomerName: String
        WorkerId: String
        WorkerName: String
        DealPrice: Int
        DealDate: String
        FinishDateWork: String
        AffilatorId: String
        Approve: Boolean
      }

      type Query {

        #Customer
        getuser(_id: String): User
        login(Username: String , Password: String): User
        CheckUsername(Username:String): User
        listReview(WorkId: String): [Review]
        listDetailReview(_id: String ): DetailReview
        listWorks(CategoryName: String ): [Works]
        DetailWork(_id: String): Works

        #Co-op
        listCategory: [Category]
        listUnitCategory(CategoryName: String): [UnitCategory]

        #Freelance
        listFreelanceWorks(WorkerId: String!): [Works]
        GetDetailWork(_id: String!,WorkerId: String!): Works

        #admin
        listFreelanceAndUser: [User]
        
      }
      

      type Mutation {

        #Customer
        register(Username: String! , Password: String! , Name: String! , BirthDate: String! , Age:Int!): User
        InsertReview(WorkId: String! , ReviewerName: String! , Reviewdata: String! , Star: Int! , Image: [String]!): DetailReview
        InsertVerifyIdCard(_id: String , ImageIdCard: String!): User
        InsertMessage(UserId1: String! , UserId2: String! , Messages: String!): ChatMessage
        InsertQoute(WorkId: String! , CustomerId: String! , CustomerName: String! , WorkerId: String! , WorkerNames: String! , DealPrice: Int! , DealDate: String! , FinishDateWork: String! ): Qoute
        EditQoute(_id: String! , WorkId: String! , CustomerId: String! , WorkerId: String! , DealPrice: Int , DealDate: String , FinishDateWork: String ): Qoute
        VerifiedReview(WorkId: String!,ReviewerName: String!): Review

        #Freelance 
        InsertWork(CategoryName: String! , WorkName: String! , CoverImage: String! , WorkerName: String! , WorkerId: String! , ScopeWork: String! , Workdays : Int! , DetailWork: String! , ExperienceWorker: String! , Price: Int! , TagWork : [String]! ): Works
        EditWork(_id: String! ,CategoryName: String! , WorkName: String! , CoverImage: String! , WorkerName: String! , WorkerId: String! , ScopeWork: String! , Workdays : Int! , DetailWork: String! , ExperienceWorker: String! , Price: Int! , TagWork : [String]! ): Works
        Addlocation(_id: String! , Latitude: Float! , Longtitude: Float!): User
        AcceptQoute(_id: String! , WorkId: String! , CustomerId: String! , WorkerId: String!): Qoute
        
        #Admin

    }
      
      schema {
        query: Query
        mutation: Mutation
      }
    `];