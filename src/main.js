import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import {MONGO_URL,EXPRESS_PORT} from './config';
import {typeDefs} from './Schema/user';
const URL = 'http://localhost';

const prepare = (o) => {
  o._id = o._id.toString()
  return o
}

export const start = async () => {
  try {

const mongodb = await MongoClient.connect(MONGO_URL);
const User = mongodb.collection('user');

const resolvers = {
      Query: {
        getuser: async (root, {_id}) => {
          return prepare(await User.findOne(ObjectId(_id)))
        },
        login: async (root,{UserName,Password}) =>{
          return prepare(await User.findOne({
            UserName: UserName,
            Password: Password
          }));
        }
      },
      Mutation: {
        register: async (root, args) => {
          const res = await User.insert(args);
          return prepare(await User.findOne({_id: res.insertedIds[1]}))
        },
      },
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
