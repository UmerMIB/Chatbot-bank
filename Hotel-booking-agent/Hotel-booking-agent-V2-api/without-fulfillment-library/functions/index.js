const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

exports.webhook = functions.https.onRequest((req,res)=> {
  console.log("req.body.result.parameters",req.body.queryResult.parameters);
      
  let params = req.body.queryResult.parameters; 

   switch(req.body.queryResult.action){
    case 'bookHotel':
      db.collection('orders').add(params)
         .then(()=>{
           return res.send({
               fulfillmentText: 
               `${params.name} your hotel booking request for ${params.roomType} room is forwarded 
               for ${params.persons} persons . We will contact you on ${params.email} soon`
             });
       })
         .catch((e =>{
           console.log('error',e);
           res.send({
              fulfillmentText:"something went wrong when writing on database"
            });
       }))
    break; 

    case'showBookings':
      db.collection('orders').get()
      .then((querySnapshot)=>{
        var orders = [];
        querySnapshot.forEach((doc) => {orders.push(    doc.data()    ) });
        ////now orders be like [ {...}, {...}, {...} ]
  
        //////////converting array to string///
        var speech = `Here are your orders \n`;
        orders.forEach((eachOrder,index) => {
          speech += `number ${index + 1} is ${eachOrder.roomType} room for ${eachOrder.persons} persons is ordered by 
          ${eachOrder.name} contact email is ${eachOrder.email} \n `
        })
       return res.send({
          fulfillmentText : speech
        });
  
      })
      .catch((e) => {
        console.log('error while getting documents', e);
        res.send({
          fulfillmentText :'something went wrong when reading from database'
        });
      })
    break;


       
    case'countBookings':
      if (params.password === `admin`) {
        db.collection('orders').get()
        .then((querySnapshot)=>{
                  var orders = [];
          querySnapshot.forEach((doc) => {orders.push(    doc.data()    ) });
          
          return res.send({
            fulfillmentText : `You have ${orders.length} orders \n. Would you like to see them ?(yes/no)`
          });
    
        })
        .catch((e) => {
          console.log('error while getting documents', e);
          res.send({
            fulfillmentText :'something went wrong when reading from database'
          });
        })
      }
      else if (params.password !== 'admin'){
        res.send({
          fulfillmentText: 'sorry either you are not the admin or your password is wrong'
        });
      }
    break;

    case 'feedBack':
      db.collection('feedBack').add(params)
         .then(()=>{
           return res.send({
               fulfillmentText: 
               `Your ${params.feedBack} has been recorded. We will try to make better
                decision on your ${params.feedBack}. Thank you`
             });
       })
         .catch((e =>{
           console.log('error',e);
           return res.send({
              fulfillmentText:"something went wrong when writing on database"
            });
       }))
    break;
    
    case 'input.unknown':
      db.collection('Invalid statements').add(req.body.queryResult.queryText)
      .then(()=>{
        return  res.send({
            fulfillmentText: `I didnot understand what you said I can book hotel
             and can accept your feedback `
        });
      })
      .catch((e =>{
        console.log('error',e);
        return res.send({
           fulfillmentText:"something went wrong when writing on database"
         });
      }))
    break;

      
    default:
      res.send({
        fulfillmentText: 'No action matched in webhook'
      });
  }
});

