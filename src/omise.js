import {OMISE_PUBLIC_KEY,OMISE_SECRET_KEY} from './config';
const omise = require('omise')({
  'publicKey': OMISE_PUBLIC_KEY,
  'secretKey': OMISE_SECRET_KEY
})

export const createcard = (cardDetail) =>{
  omise.tokens.create(cardDetail).then(function(token) {

  // promise for create or charge user's card
}).done();

}
