import {OMISE_PUBLIC_KEY,OMISE_SECRET_KEY} from './config';
const omise = require('omise')({
  'publicKey': OMISE_PUBLIC_KEY,
  'secretKey': OMISE_SECRET_KEY
})

export const createcard = (cardDetail) =>{
  omise.tokens.create(cardDetail).then(function(token) {

  console.log(token);
  return omise.customers.create({
    email: "testemail@email.com",
    description: "test (id: 30)",
    card: token.id
  });

}).then(function(customer) {

  console.log(customer);
  return omise.charges.create({
    amount: 50000,
    currency: 'thb',
    customer: customer.id
  });

}).then(function(charge) {

  console.log(charge);

}).error(function(err) {

  console.log(err);

}).done();

}
