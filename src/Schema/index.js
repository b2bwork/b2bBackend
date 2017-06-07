export const typeDefs =  [`
      

      type User {
        _id: String
        GoogleUserID: String
        FacebookUserID: String
        Username: String
        Password: String
        Email: String
        Name: String
        ProfileImage: String 
        BirthDate: String 
        Education: [String]
        Skill: [String]
        Age: Int
        Latitude: Float
        Longtitude: Float
        ImageIdCard: String
        ImageBank: String
        VerifyIdentify: Boolean
        Money: String
        TokenOmise: String
        BankCardId: String
        VerifyOmiseToken: Boolean
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
        ImageBefore: [String]
        ImageAfter: [String]
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

      type CustomerProblemPost{
        _id: String
        CustomerId: String
        DetailProblem: String
        ImageProblem: [String]
        Latitude: Float
        Longtitude: Float
        Category: String
        Tags: [String]
      }
      type FreelanceAcceptWork{
        _id: String
        CustomerProblemId: String
        WorkerId: String 
        QoutePrice: Int

      }

      type Query {

        #Customer
        getuser(_id: String): User
        CheckUsername(Username:String): User
        listReview(WorkId: String): [Review]
        GetDetailReview(_id: String ): DetailReview
        listWorks(CategoryName: String ): [Works]
        DetailWork(_id: String): Works
        listFreelancelocation(Latitude: Float! , Longtitude: Float): [User]
        GetFreelancelocation(_id:String!): User
        ListFreelanceAcceptWork(_id:String!): [FreelanceAcceptWork]
        

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
        register(Username: String! , Password: String! , Email: String! , Name: String! , BirthDate: String!): User
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
        CheckActivateTransferMoney(_id:String! , WorkerId: String! , Token: String!): CustomerTransferMoney
        PostProblem( CustomerId: String , DetailProblem: String , ImageProblem: [String] , Latitude: Float , Longtitude: Float ,  Category: String , Tags: [String]): CustomerProblemPost
        ChooseFreelanceSolve(WorkerId: String!): FreelanceAcceptWork


        #CO-OP (Customer , Freelance )
          AddBankCard(_id: String! , BankCardId: String! , Name:String! , Email: String! , BankBland: String! , BankAccountName: String! , BankNumber: String! ): User
          CheckVerifyBank(_id: String! , TokenOmise: String!):User
          login(Username: String , Password: String): User
          AddEducation(_id: String! , Education: [String]): User
          
        #Freelance 
        InsertWork(CategoryName: String , WorkName: String , WorkerId: String , ScopeWork: String , Workdays : Int , DetailWork: String , ExperienceWorker: String , Price: Int , TagWork : [String] ): Works
        EditWork(_id: String! ,CategoryName: String! , WorkName: String! , CoverImage: String! , WorkerName: String! , WorkerId: String! , ScopeWork: String! , Workdays : Int! , DetailWork: String! , ExperienceWorker: String! , Price: Int! , TagWork : [String]! ): Works
        Addlocation(_id: String! , Latitude: Float! , Longtitude: Float!): User
        AcceptQoute(_id: String! , WorkId: String! , CustomerId: String! , WorkerId: String!): Qoute
        AddWorkSchedule(WorkId: String! , WorkName: String! , WorkerId: String! , WorkerName: String! , CustomerId: String! , CustomerName: String! , StartWorkDate: String! , FinishWorkDate: String!): Calendar
        CheckTransferMoney(_id:String! ,WorkerId:String!, Token:String!): User
        AcceptCustomerProblem(CustomerProblemId: String! , WorkerId: String! , QoutePrice: Int!): FreelanceAcceptWork


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