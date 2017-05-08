import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import {MONGO_URL,EXPRESS_PORT,UPLOAD_PATH,WEBSOCKET_PORT} from './config';
import {typeDefs} from './Schema/index';
import multer from 'multer';
import fs from 'fs';
import { createServer } from 'http';
import {PubSub, SubscriptionManager} from "graphql-subscriptions";
import { SubscriptionServer } from 'subscriptions-transport-ws';
const URL = 'http://localhost';
const pubsub = new PubSub();
const prepare = (o) => {
  o._id = o._id.toString()
  return o
}

export const start = async () => {
  try {
const mongodb = await MongoClient.connect(MONGO_URL);
const User = mongodb.collection('user');
const Category = mongodb.collection('category');
const Review = mongodb.collection('review');
const ImageReview = mongodb.collection('imagereview');
const Works = mongodb.collection('Works');
const Message = mongodb.collection('ChatMessages');
const Qoute = mongodb.collection('QouteWork');
const Calendar = mongodb.collection('Calendar');
const CustomerTranferMoney = mongodb.collection('CustomerTranferMoney');
const resolvers = {
      Query: {
        /**
         * Beginning for Customer
         */
        getuser: async (root, {_id}) => {
          return prepare(await User.findOne(ObjectId(_id)))
        },
        login: async (root,{Username,Password}) =>{
          return prepare(await User.findOne({
            Username: Username,
            Password: Password
          }));
        },
        CheckUsername: async (root,{Username}) => {
          return prepare(await User.findOne({
            Username: Username
          }))
        },
        listCategory: async (_id,{UnitCategory})=>{
          return (await Category.find({
            UnitCategory: false
          }).toArray()).map(prepare)
        },
        listUnitCategory: async (root,{CategoryName})=>{
          return (await Category.find({
            CategoryName: CategoryName,
            UnitCategory: true
          }).toArray()).map(prepare)
        },
        listReview: async (root,{WorkId})=>{
          return (await Review.find({
            WorkId: WorkId.toString()
          }).toArray()).map(prepare)
        },
        GetDetailReview: async (root,{_id})=>{
          return prepare(await Review.findOne({
            _id: ObjectId(_id)
          }))
        },
        listWorks: async (root,{CategoryName})=>{
          return (await Works.find({
            CategoryName: CategoryName
          }).toArray()).map(prepare)
        },
        DetailWork: async (root,{_id})=>{
          return prepare(await Works.findOne({
            _id: ObjectId(_id)
          }))
        },
        listFreelancelocation: async (root,{Latitude , Longtitude}) =>{
          return (await Review.find({
            $and:[{
              Latitude : {$lte: 0.59971,$gte: 0.59971 },
              Longtitude: {$lte: 0.59971,$gte: 0.59971 }
            }]
          }).toArray()).map(prepare)
        },
        GetFreelancelocation: async (root,{_id}) =>{
          return prepare(await User.findOne({
            _id: ObjectId(_id)
          }))
        }
      /**
         * Ending for Customer
         */
        ,
      /**
       *  Beginning for Freelance
       */
       listFreelanceWorks: async (root,{WorkerId}) =>{
         return (await Works.find({
            WorkerId: WorkerId
          }).toArray()).map(prepare)
       },
       GetDetailWork: async (root,{_id,WorkerId}) =>{
         return prepare(await Works.findOne({
            _id: ObjectId(_id),
            WorkerId: WorkerId
          }))
       }
       /**
        * Ending for Freelance
        */

        /**
         * Beginning for Admin
         */
        ,
      listFreelanceAndUser: async ()=>{
        return (await User.find({}).toArray()).map(prepare)
      },
      listWorksfromFreelance: async ()=>{
        return (await Works.find({}).toArray()).map(prepare)
      },
      listFreelanceForVerify: async () =>{
        return (await User.find({
          Verify: false
        }).toArray()).map(prepare)
      },
      getProfileFreelance: async (root,{_id}) =>{
      return prepare(await User.findOne({
            _id: ObjectId(_id)
          }))
        },
      getDetailWork: async (root,{_id}) =>{
        return prepare(await Works.findOne({
            _id: ObjectId(_id)
          }))
      }
      }
      ,
      Mutation: {

        /**
         * Beginning for Customer
         */
        register: async (root, {Username,Password,Name,Image,BirthDate,Age}) => {
          const res = await User.insert({
            Username: Username,
            Password: Password,
            Name: Name,
            Image: Image,
            BirthDate: BirthDate,
            Age: Age,
            Money: null
          });
          return prepare(await User.findOne({_id: res.insertedIds[1]}))
        },
        InsertReview: async (root,args) =>{
        const res = await Review.insert(args);
          return prepare(await Review.findOne({_id: res.insertedIds[1]}))
      },
        InsertVerifyIdCard: async (root,{_id,ImageIdCard}) =>{
        const res = await User.updateOne({
          _id: ObjectId(_id)
        },{
          $set: {
                 ImageIdCard: ImageIdCard,
                 VerifyIdCard: false
          }
        },
        function(result){
          return result;
        }
        );
          return res;
      },
      InsertMessage: async (root,{UserId1 , UserId2 , Message,Image}) =>{
        const searchMessage = await Message.findOne({
          UserId1 : UserId1, 
          UserId2 : UserId2
        }).toString();
        if(searchMessage != null){
          const InsertMessage = await Message.updateOne(
            {
              UserId1 : UserId1,
              UserId2 : UserId2
            },
            {
              $push :{
                Messages:Message
              }
            }
          );
        }else if(searchMessage == null){
          const InserFirstMessage = await Message.insert(
            {
              UserId1: UserId1,
              UserId2: UserId2,
              Messages:Message
              
            }
          )
        }
      },
      InsertQoute: async (root,{WorkId , CustomerId , CustomerName , FreelanceId , FreelanceName , DealPrice , DealDate , FinishDateWork}) =>{
          const insertQoute = await Qoute.insert({
            WorkId: WorkId,
            CustomerId: CustomerId,
            CustomerName: CustomerName,
            FreelanceId: FreelanceId,
            FreelanceName: FreelanceName,
            DealPrice: DealPrice,
            DealDate: DealDate,
            FinishDateWork: FinishDateWork,
            Approve: false
          });
          return prepare(await Qoute.findOne({_id: insertQoute.insertedIds[1]}))
      },
      EditQoute: async (root,{_id , WorkId , CustomerId , WorkerId , DealPrice , DealDate , FinishDateWork}) => {
          const editQoute = await Qoute.updateOne({
            _id : ObjectId(_id),
            WorkId: WorkId,
            CustomerId:CustomerId,
            WorkerId: WorkId
          },{
             $set:{
               DealDate: DealDate,
               DealPrice:DealPrice,
               FinishDateWork: FinishDateWork,
               Approve: false
             }
          })
      },
      VerifiedReview: async (root,{WorkId,ReviewerName}) =>{
          const verifiedReview = await Review.updateOne({
            WorkId: WorkId,
            ReviewerName: ReviewerName
          },
          {
            $set:{
               Verified: true
            }
          })
      },
      FinishWork: async (root,{_id}) =>{
        const FinishWork = await Qoute.updateOne({
          _id: ObjectId(_id)
        },{$set:{Finishwork: true}})
      },
      AddFreelanceWorkSchedule: async (root,{WorkId , WorkName , WorkerId , WorkerName , CustomerId , CustomerName , StartWorkDate , FinishWorkDate}) =>{
        const AddFreelanceWorkSchedule = await Calendar.insert({
            WorkId: WorkId ,
            WorkName: WorkName , 
            WorkerId: WorkerId , 
            WorkerName: WorkerName ,
            CustomerId: CustomerId , 
            CustomerName: CustomerName , 
            StartWorkDate: StartWorkDate , 
            FinishWorkDate: FinishWorkDate,
            FreelanceCalendar: false,
            CustomerCalendar: true

         })
      },
      TranferMoney: async (root,{CustomerId , CustomerName , WorkerId, WorkerName , DealPrice}) =>{
        const tranferMoney = await CustomerTranferMoney.insert({
            CustomerId: CustomerId ,
            CustomerName:CustomerName ,
            WorkerId: WorkerId ,
            WorkerName:WorkerName ,
            DealPrice: DealPrice,
            Token: null,
            Activated: false
        })
      }
      /**
         * Ending for Customer
         */
       ,
       /**
        * Beginning for freelance
        */
       InsertWork: async (root,{CategoryName , WorkName , CoverImage , WorkerName , WorkerId , ScopeWork, Workdays, DetailWork , ExperienceWorker , Price , TagWork }) =>{
         const insertWork = await Works.insert({
           CategoryName: CategoryName,
           WorkName: WorkName,
           CoverImage: CoverImage,
           WorkerName: WorkerName,
           WorkerId: WorkerId,
           ScopeWork: ScopeWork,
           Workdays: Workdays,
           DetailWork: DetailWork,
           ExperienceWorker: ExperienceWorker,
           Price: parseInt(Price),
           TagWork: TagWork,
           Verify: false

         })
         return prepare(await Works.findOne({_id: insertWork.insertedIds[1]}))
       },
       EditWork: async (root,{_id , CategoryName , WorkName , CoverImage , WorkerName , WorkerId , ScopeWork, Workdays, DetailWork , ExperienceWorker , Price , TagWork }) =>{
         const editWork = await Works.updateOne({
            _id: ObjectId(_id)
          },
          {
            $set:{
               CategoryName: CategoryName,
               WorkName: WorkName,
               CoverImage: CoverImage,
               WorkerName: WorkerName,
               WorkerId: WorkerId,
               ScopeWork: ScopeWork,
               Workdays: Workdays,
               DetailWork: DetailWork,
               ExperienceWorker: ExperienceWorker,
               Price: parseInt(Price),
               TagWork: TagWork,
               Verify: false
            }
          })
       },
       Addlocation: async (root,{_id , Latitude , Longtitude}) =>{
         const addlocation = await User.updateOne({
            _id: ObjectId(_id)
         },
         {
           $set:{
             Latitude: parseFloat(Latitude) , 
             Longtitude: parseFloat(Longtitude)
           }
         })
       },
       AcceptQoute: async (root,{_id, WorkId , CustomerId , WorkerId}) =>{
         const acceptQoute = await Qoute.updateOne(
           {
             _id: ObjectId(_id),
             WorkId: WorkId,
             WorkerId: WorkerId,
             CustomerId: CustomerId
           },
           {
             $set:{
               Approve: true
             }
           }
         )
       },
       AddWorkSchedule: async(root,{WorkId , WorkName , WorkerId , WorkerName , CustomerId , CustomerName , StartWorkDate , FinishWorkDate}) => {
         const addWorkSchedule = await Calendar.insert({
            WorkId: WorkId ,
            WorkName: WorkName , 
            WorkerId: WorkerId , 
            WorkerName: WorkerName ,
            CustomerId: CustomerId , 
            CustomerName: CustomerName , 
            StartWorkDate: StartWorkDate , 
            FinishWorkDate: FinishWorkDate,
            FreelanceCalendar: true,
            CustomerCalendar: false

         })
       },
       MoneyUpdate: async (root,{_id , Money}) =>{
         const moneyUpdate = await User.updateOne({
           _id: ObjectId(_id)
         },{$inc: {Money: Money}})
       }
       /**
        * Ending for Freelance
        */
        ,
        /**
         * Beginning for Admin
         */
        InsertCategory: async (root,{Name, Image})=>{
           const insertCategory = await Category.insert({
             Name: Name,
             Image:Image
           })
        },
        InsertUnitCategory: async (root,{CategoryName , Name , Image}) =>{
          const insertUnitCategory = await Category.insert({
             CategoryName: CategoryName,
             Name: Name,
             Image:Image
          })
        },
        VerifyFreelanceAndUser: async (root,{_id}) =>{
          const verifyFreelance = await User.updateOne(
            { _id: ObjectId(_id)},
            {$set: {Verify:true}}
          )
        },
        VerifyFreelanceWork: async (root,{_id}) =>{
          const verifyFreelanceWork = await Works.updateOne(
            {_id: ObjectId(_id)},{$set:{Verify: true}})
        }
        /**
         * Ending for Admin
         */
      }
    }
    
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })
    const subscriptionManager = new SubscriptionManager({schema, pubsub});

    const app = express()


    app.use(cors())
    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))

    app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql'
    }))
    const server = createServer(app);
    server.listen(EXPRESS_PORT, () => {
      console.log(`listen port: ${EXPRESS_PORT}`)
    })
    const appWS = createServer((request, response) => {
    response.writeHead(404);
    response.end();
    });
  
    appWS.listen(WEBSOCKET_PORT,() => {
       console.log(`Websocket listening on port ${WEBSOCKET_PORT}`)
    })

    const subscriptionServer = new SubscriptionServer({
        onConnect: async(connectionParams) => {
           console.log('WebSocket connection established');
        },
        subscriptionManager: subscriptionManager
        }, {
         server: appWS,
         path: '/subscriptions'
        })

  } catch (e) {
    console.log(e)
  }

}
