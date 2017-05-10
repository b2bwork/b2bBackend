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
        ImageBank: String
        Verify: Boolean
        Money: Float
        TokenOmise: String
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
      
      type Calendar{
        _id: String
        WorkId: String
        WorkName: String
        WorkerId: String
        WorkerName: String
        CustomerId: String
        CustomerName: String
        StartWorkDate: String
        FinishWorkDate: String
        FreelanceCalendar: Boolean
        CustomerCalendar: Boolean

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
        Finishwork: Boolean
      }

      type CustomerTransferMoney{
        _id: String
        WorkId: String
        CustomerId: String
        CustomerName: String
        WorkerId: String
        WorkerName: String
        DealPrice: Int
        Token: String
        Activated: Boolean
      }

      type Query {

        #Customer
        getuser(_id: String): User
        login(Username: String , Password: String): User
        CheckUsername(Username:String): User
        listReview(WorkId: String): [Review]
        GetDetailReview(_id: String ): DetailReview
        listWorks(CategoryName: String ): [Works]
        DetailWork(_id: String): Works
        listFreelancelocation(Latitude: Float! , Longtitude: Float): [User]
        GetFreelancelocation(_id:String!): User

        #Co-op
        listCategory: [Category]
        listUnitCategory(CategoryName: String): [UnitCategory]

        #Freelance
        listFreelanceWorks(WorkerId: String!): [Works]
        GetDetailWork(_id: String!,WorkerId: String!): Works
        

        #admin
        listFreelanceAndUser: [User]
        listWorksfromFreelance: [Works]
        listWorksIncomplete: [Works]
        listFreelanceForVerify: [User]
        getProfileFreelance(_id: String!): User
        getDetailWork(_id: String!): Works
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
        FinishWork(_id: String!): Qoute
        AddFreelanceWorkSchedule(WorkId: String! , WorkName: String! , WorkerId: String! , WorkerName: String! , CustomerId: String! , CustomerName: String! , StartWorkDate: String! , FinishWorkDate: String!): Calendar
        VerifyCustomerBankCard(_id: String! , Name:String! , Email:String! , CardNumber: String! , ExpireMonth: Int! , ExpireYear: Int! , City: String! , PostalCode: String! ):User
        TranferMoney(WorkId: String! , CustomerId: String! , CustomerName: String! , WorkerId: String! , WorkerName: String! , DealPrice: Int!): CustomerTransferMoney
        CheckActivateTransferMoney(_id: String! , Token: String!): CustomerTransferMoney

        #CO-OP (Customer , Freelance )
          #AddBankCard(): User
          
        #Freelance 
        InsertWork(CategoryName: String! , WorkName: String! , CoverImage: String! , WorkerName: String! , WorkerId: String! , ScopeWork: String! , Workdays : Int! , DetailWork: String! , ExperienceWorker: String! , Price: Int! , TagWork : [String]! ): Works
        EditWork(_id: String! ,CategoryName: String! , WorkName: String! , CoverImage: String! , WorkerName: String! , WorkerId: String! , ScopeWork: String! , Workdays : Int! , DetailWork: String! , ExperienceWorker: String! , Price: Int! , TagWork : [String]! ): Works
        Addlocation(_id: String! , Latitude: Float! , Longtitude: Float!): User
        AcceptQoute(_id: String! , WorkId: String! , CustomerId: String! , WorkerId: String!): Qoute
        AddWorkSchedule(WorkId: String! , WorkName: String! , WorkerId: String! , WorkerName: String! , CustomerId: String! , CustomerName: String! , StartWorkDate: String! , FinishWorkDate: String!): Calendar
        CheckTransferMoney(_id:String , Token:String!): User

        #Admin
        InsertCategory(Name: String! , Image: String! ): Category
        InsertUnitCategory(CategoryName: String! , Name: String! , Image: String! ): UnitCategory
        VerifyFreelanceAndUser(_id: String!): User
        VerifyFreelanceWork(_id: String!): Works
    }

    type Subscription {
        
        #Customer
        Message(UserId:String!): ChatMessage
    }
      
      schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
      }
    `];