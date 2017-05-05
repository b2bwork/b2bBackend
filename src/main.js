import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import {MONGO_URL,EXPRESS_PORT,UPLOAD_PATH} from './config';
import {typeDefs} from './Schema/index';
import multer from 'multer';
import fs from 'fs';
const URL = 'http://localhost';

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
        listDetailReview: async (root,{_id})=>{
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
        }
      /**
         * Ending for Customer
         */
        ,
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
            Age: Age
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
      InsertQoute: async (root,{CustomerId , CustomerName , FreelanceId , FreelanceName , DealPrice , DealDate , FinishDateWork}) =>{
          const insertQoute = await Qoute.insert({
            CustomerId: CustomerId,
            CustomerName: CustomerName,
            FreelanceId: FreelanceId,
            FreelanceName: FreelanceName,
            DealPrice: DealPrice,
            DealDate: DealDate,
            FinishDateWork: FinishDateWork
          });
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
      }
      /**
         * Ending for Customer
         */
       ,
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
         }

         )
       }
      }
    }
    
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })

    const app = express()


    app.use(cors())
    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))

    app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql'
    }))

    app.listen(EXPRESS_PORT, () => {
      console.log(`listen port: ${EXPRESS_PORT}`)
    })

  } catch (e) {
    console.log(e)
  }

}
