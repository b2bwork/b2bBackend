const complession = require('compression');
import express from 'express'
import {MongoClient, ObjectId} from 'mongodb'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'
import {MONGO_URL,EXPRESS_PORT,
       UPLOAD_PATH,WEBSOCKET_PORT,
       OMISE_SECRET_KEY,OMISE_PUBLIC_KEY,
       GOOGLE_CLIENT_ID,GOOGLE_SECRET_KEY,GOOGLE_CALLBACK_URL,
       FACEBOOK_APP_ID,FACEBOOK_APP_KEY,FACEBOOK_CALLBACK_URL} from './config';
import {typeDefs} from './Schema/index';
import multer from 'multer';
import fs from 'fs';
import { createServer } from 'http';
import {PubSub, SubscriptionManager} from "graphql-subscriptions";
import { SubscriptionServer } from 'subscriptions-transport-ws';
import {listImage} from './util';
const URL = 'http://localhost';
const pubsub = new PubSub();
const omise = require('omise')({
  'publicKey': OMISE_PUBLIC_KEY,
  'secretKey': OMISE_SECRET_KEY
})
var passportjs = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var facebookAuth = require('passport-facebook');

const prepare = (o) => {
  o._id = o._id.toString()
  return o
}


export const start = async () => {
  try {

const mongodb = await MongoClient.connect(MONGO_URL);

//mongoDB
const User = mongodb.collection('user');
const Category = mongodb.collection('category');
const Review = mongodb.collection('review');
const ImageReview = mongodb.collection('imagereview');
const Works = mongodb.collection('Works');
const Message = mongodb.collection('ChatMessages');
const Qoute = mongodb.collection('QouteWork');
const Calendar = mongodb.collection('Calendar');
const CustomerTranferMoney = mongodb.collection('CustomerTranferMoney');
const CustomerProblem = mongodb.collection('CustomerProblem')

//passportjs
passportjs.use(new GoogleStrategy({
                    clientID: GOOGLE_CLIENT_ID,
                    clientSecret: GOOGLE_SECRET_KEY,
                    callbackURL: GOOGLE_CALLBACK_URL,
                },async (accessToken, refreshToken, profile, done) => {
                       let checkToken = await User.findOne({ GoogleUserID: profile.id }).then(async (data) => {
                        if(data == null ){
                            await User.insert(
                               {GoogleUserID: profile.id,
                                Name: profile.displayName,
                                ProfileImage: profile.photos.value,
                                Money: '0'});
                          return 'registered';
                        }else if(data != null){
                          return 'Loged';
                        }
                      });
                      done(null,{UserID: profile.id , Username: profile.displayName,ProfileImage: profile.photos[0].value});
                      
                      
         }))

passportjs.use(new facebookAuth({
                    clientID: FACEBOOK_APP_ID,
                    clientSecret: FACEBOOK_APP_KEY,
                    callbackURL: FACEBOOK_CALLBACK_URL,
                    profileFields: ['id', 'displayName', 'photos', 'email']
                },async function (accessToken, refreshToken, profile, done) {
                  console.log(profile);
                     let checkToken = await User.findOne({ FacebookUserID: profile.id }).then(async (data) => {
                        if(data == null ){
                            await User.insert({FacebookUserID: profile.id,
                                               Name: profile.displayName,
                                               //ProfileImage: profile.photos.value,
                                               Money: '0'});
                          return 'Registered';
                        }else if(data != null){
                          return 'Loged';
                        }
                      });
                      done(null,{UserID: profile.id , Username: profile.displayName , });//ProfileImage: profile.photos[0].value});
                      
                      
         }));
     

//Graphql data
let ListFreelanceAcceptWork = [];
const resolvers = {
      Query: {
        /**
         * Beginning for Customer
         */
        getuser: async (root, {_id}) => {
          return prepare(await User.findOne(ObjectId(_id)))
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
        },
        ListFreelanceAcceptWork: (root,{_id}) =>{
          return ListFreelanceAcceptWork.filter(function(x){
            return (x._id == _id)
          })

        }
      /**
         * Ending for Customer
         */
        ,
      /**
       *  Begining for Co op
       */
      listUserProfile: async (root,{_id}) =>{
        return prepare(await User.findOne({_id: ObjectId(_id)}));

      },
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
        register: async (root, {Username,Password,Email,Name,Image,BirthDate}) => {

          const checkUser = await User.findOne({Username: Username}).then( async (data)=>{
               if(data!= null ){

                 return {_id: 'hasUser'}

               }else if(data == null){
                   const res = await User.insert({
                       Username: Username,
                       Password: Password,
			                 Email: Email,
                       Name: Name,
                       Image: Image,
                       BirthDate: BirthDate,
                       Money: 0
                     });  

              return {_id: 'registered'}
          }     
          }
          )     
          return checkUser;
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
      TranferMoney: async (root,{WorkId , CustomerId , CustomerName , WorkerId, WorkerName , DealPrice}) =>{
        const getWorkerToken =  prepare( await User.findOne({
                                         _id: ObjectId(WorkId) 
                                     }));
               if(getWorkerToken.TokenOmise != null){
                 const tranferMoneyOmise = await omise.transfers.create({'amount': parseInt(DealPrice)
                                  , 'recipient': getWorkerToken.TokenOmise})
                         .then(async (Token) =>{
                            const AddTranferToken = await CustomerTranferMoney.insert({
                            WorkId: WorkId,
                            CustomerId: CustomerId ,
                            CustomerName:CustomerName ,
                            WorkerId: WorkerId ,
                            WorkerName:WorkerName ,
                            DealPrice: DealPrice,
                            Token: Token.id,
                            Activated: false
                        })
          
        }).error((err)=> console.log(err))
               }
      },VerifyCustomerBankCard: async (root,{_id , Name , Email , CardNumber , ExpireMonth , ExpireYear , City , PostalCode}) => {
        let cardDetail = {
             card: {
                'name': Name,
                'city': City,
                'postal_code': PostalCode,
                'number': CardNumber,
                'expiration_month': parseInt(ExpireMonth),
                'expiration_year': parseInt(ExpireYear)
              }
           };
          const Omise = omise.tokens.create(cardDetail).then(async (Token)=>{
             omise.customers.create({
               email: Email,
               description: `ชื่อลูกค้า: ${Name}`,
               card: Token.id
             });

              const insertBankCard = await User.updateOne({
               _id: ObjectId(_id)
             },{$set:{
                  TokenOmise: Token.id
             }});
          })
       },
       CheckActivateTransferMoney: async (root,{_id,WorkerId,Token}) =>{
          const check = omise.transfers.retrieve(Token).then( async (data)=>{
            if(data.sent == true){

              const Activated = await CustomerTranferMoney.updateOne({
                _id: ObjectId(_id)
              },{$set:{
                Activated: true
              }})
              const moneyUpdate = await User.updateOne({
                     _id: ObjectId(WorkerId)
                   },{$inc: {Money: data.amount}})
            }else if(data.sent == false){
              return "Token cannot pass"
            }
          })
       },
       PostProblem: async (root,{CustomerId , DetailProblem , ImageProblem , Latitude , Longtitude ,  Category , Tags}) =>{
         const postproblem = await CustomerProblem.insert({
           CustomerId: CustomerId , 
           DetailProblem: DetailProblem , 
           ImageProblem: ImageProblem , 
           Latitude: Latitude , 
           Longtitude: Longtitude ,  
           Category: Category , 
           Tags: Tags
         });
         return prepare(await CustomerProblem.findOne({_id: CustomerProblem.insertedIds[1]}))
       },
       ChooseFreelanceSolve: async (root,{WorkerId}) =>{
         const filter = ListFreelanceAcceptWork.filter((list)=>{
           return (list.WorkerId == WorkerId)
         })

         const insert = await CustomerProblem.insert({
           CustomerProblemId: filter.CustomerProblemId,
           WorkerId: filter.WorkerId,
           QoutePrice: parseInt(filter.QoutePrice)
           
         })
       }
      /**
         * Ending for Customer
         */

       ,
       /**
        * Beginning Co-Op
        */
        AddBankCard: (root,{_id , BankCardId , Name , Email , BankBland , BankAccountName , BankNumber}) => {
          const OmiseCreateRecipient = omise.recipients.create({
                               'name': `${Name}`,
                               'email': `${Email}`,
                               'type': 'individual',
                               'bank_account': {
                                 'brand': `${BankBland}`,
                                 'number': `${BankNumber}`,
                                 'name': `${BankAccountName}`
                               }
                              }).then(async (recipient)=>{
                                const insert = await User.updateOne(
                                      {
                                         _id: ObjectId(_id)
                                      },{$set:{
                                         TokenOmise: recipient.id
                                      }
                                    })
                              })
        },
        CheckVerifyBank: (root,{_id, TokenOmise}) =>{
          const checkverifybank = omise.recipients.retrieve(TokenOmise).then(async (tokens) =>{
            if(tokens.verify == true){
              await User.updateOne({
                _id: ObjectId(_id)
              },{
                $set: {
                   VerifyOmiseToken: true
              }
            })
     
            }else if(tokens.verify == false){
              return [{return: "not verify"}]
            }
          })
        },
        login: async (root,{Username,Password}) =>{
          return prepare(await User.findOne({
            Username: Username,
            Password: Password
          }));
        },
        AddBank: async (root,{_id , Bank , BranchBank , BankNumber }) =>{
          let add = await User.updateOne({_id: ObjectId(_id)},
              {$set: { Bank: Bank,
                       BranchBank: BranchBank,
                       BankNumber: BankNumber } }).then((data , err) => {
                if(!err){
                  return {_id: 'added'}
                }else{
                  console.log(err);
                  return {_id: 'error'}
                }
              })
              return add
        },
        AddBasicUserData: async (root,{_id ,FirstName , LastName , BirthDate ,Email, Telephone} ) =>{
          let add = await User.updateOne({_id: ObjectId(_id)},
             {$set: {FirstName: FirstName ,
                     LastName: LastName ,
                     BirthDate: BirthDate , 
                     Telephone: Telephone,
                     Email: Email
                    }})
             .then((data,err)=>{
                 if(!err){
                       return {_id: 'added'}
                     }else{
                       console.log(err);
                       return {_id: 'error'}
                     }
               })

            return add;   
        },
        AddIdCard: async (root,{_id , RealName , Address , IdCardNumber}) =>{
           let add = await User.updateOne({_id: ObjectId(_id)},
               {$set: {
                  RealName: RealName ,
                  Address: Address , 
                  IdCardNumber: IdCardNumber
               }})
              .then((data,err)=>{
                 if(!err){
                       return {_id: 'added'}
                     }else{
                       return {_id: 'error'}
                     }
               })
            console.log(add);
            return add; 
        }
        /**
         * Ending Co-Op
         */
        ,
       /**
        * Beginning for freelance
        */
       InsertWork: async (root,{CategoryName , WorkName , WorkerId , ScopeWork, Workdays, DetailWork , ExperienceWorker , Price , TagWork }) =>{
         const insertWork = await Works.insertOne({
           CategoryName: CategoryName,
           WorkName: WorkName,
           WorkerId: WorkerId,
           ScopeWork: ScopeWork,
           Workdays: Workdays,
           DetailWork: DetailWork,
           ExperienceWorker: ExperienceWorker,
           Price: parseInt(Price),
           TagWork: TagWork,
           Verify: false

         }).then((data) => {
           return {_id: data.insertedId}
         })
         return insertWork
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
       CheckTransferMoney: async (root,{_id ,WorkerId , Token}) =>{
        const check = omise.transfers.retrieve(Token).then( async (data)=>{
            if(data.sent == true){

              const Activated = await CustomerTranferMoney.updateOne({
                _id: ObjectId(_id)
              },{$set:{
                Activated: true
              }})
              const moneyUpdate = await User.updateOne({
                      _id: ObjectId(_id)
                   },{$inc: {Money: data.amount}})
            }else if(data.sent == false){
              return "Token cannot pass"
            }
          })
       },
       AcceptCustomerProblem: async (root,{CustomerProblemId , WorkerId , QoutePrice}) =>{
         ListFreelanceAcceptWork.push({
            CustomerProblemId: CustomerProblemId,
            WorkerId: WorkerId,
            QoutePrice: parseInt(QoutePrice)
         });
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
    const storage = multer.diskStorage({
                       destination: __dirname + '/Images/' ,
                       filename: function (req, file, cb) {
                            cb(null , Date.now() + file.originalname)
                        }
                      })
 
    let upload = multer({ storage: storage })


    const app = express()
    app.use('/Images', express.static(__dirname +'/Images'))
    app.use(complession())
    app.use(cors())
    app.use(bodyParser.json());
    app.use(passportjs.initialize())
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/upload/addwork',upload.any(),async (req, res, next)=>{
         /*const addRefImage = await Works.insert({
           Image: `http://128.199.68.65:3001/Images/${req.files[0].filename}`
         });*/
          console.log(req.body)
          //console.log(req.files);
          //console.log(listImage);
          res.send({ responseText: 'tes' });
    })
    
    app.post('/upload/userBank',upload.any(),async (req, res, next)=>{
      console.log(req.files[0]);
         const ImageBank = await User.updateOne({
            _id: ObjectId(req.body._id)
          },{$set: {
            ImageBank: `http://128.199.68.65:3001/Images/${req.files[0].filename}`
          }}).then((data)=>{
            console.log(data)
            return {_id: 'uploaded'}
          }).catch(()=>{
            return {_id: 'error'}
          })
          res.send({ responseText: ImageBank });
    })

    app.post('/upload/userIDcard',upload.any(),async (req, res, next)=>{
      console.log(req.files[0]);
         const ImageIDcard = await User.updateOne({
            _id: ObjectId(req.body._id)
          },{$set: {
            ImageIdCard: `http://128.199.68.65:3001/Images/${req.files[0].filename}`
          }}).then((data)=>{
            console.log(data)
            return {_id: 'uploaded'}
          }).catch(()=>{
            return {_id: 'error'}
          })
          res.send({ responseText: ImageIDcard });
    })


    app.get('/auth/google',passportjs.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
    app.get('/auth/google/callback',passportjs.authenticate('google', { session: false}),
         function(req, res) {
           console.log(req.user);
           res.redirect(`http://128.199.68.65:3000/loged/${req.user.UserID}`);
          });
    app.get('/auth/facebook', passportjs.authenticate('facebook',{scope: ['public_profile','email']}));
    app.get('/auth/facebook/callback', passportjs.authenticate('facebook', { session: false }),
         function(req, res) {
           console.log(req.user);
           res.redirect(`http://128.199.68.65:3000/loged/${req.user.UserID}`);          
          });
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
