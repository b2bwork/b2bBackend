import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import {MONGO_URL,EXPRESS_PORT} from './config';
import {typeDefs} from './Schema/index';
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
const resolvers = {
      Query: {
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
        listCategory: async ()=>{
          return prepare(await Category.find({
            unitCategory: false
          }))
        },
        listUnitCategory: async (root,{CategoryName})=>{
          return prepare(await Category.find({
            CategoryName: CategoryName
          }))
        },
        listReview: async (root,{Workid})=>{
          return prepare(await Category.find({
            Workid: Workid
          }))
        },
        listDetailReview: async (root,{_id})=>{
          return prepare(await Category.findOne({
            _id: _id
          }))
        }
        ,
        listWorks: async (root,{CategoryName})=>{
          return prepare(await Works.find({
            CategoryName: CategoryName
          }))
        }

      },
      Mutation: {
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
      InsertMessage: async (root,{UserId1 , UserId2 , Messages,Image}) =>{
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
              $addToSet :{
                Messages: Messages,
                Image: Image
              }
            }
          );
        }else if(searchMessage == null){

        }
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
