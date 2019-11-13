const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

exports.webhook = functions.https.onRequest((req,res)=> {
  console.log("req.body.result.parameters",req.body.result.parameters);
      
  let params = req.body.result.parameters; 

   switch(req.body.result.action){
    case 'bookHotel':
      db.collection('orders').add(params)
         .then(()=>{
           res.send({
               speech: 
               `${params.name} your hotel booking request for ${params.roomType} room is forwarded 
               for ${params.persons} persons . We will contact you on ${params.email} soon`
             });
       })
         .catch((e =>{
           console.log('error',e);
           res.send({
              speech:"something went wrong when writing on database"
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
        res.send({
          speech : speech
        });
  
      })
      .catch((e) => {
        console.log('error while getting documents', e);
        res.send({
          speech :'something went wrong when reading from database'
        });
      })
    break;


       
    case'countBookings':
      if (params.password === "****") {
        db.collection('orders').get()
        .then((querySnapshot)=>{
                  var orders = [];
          querySnapshot.forEach((doc) => {orders.push(    doc.data()    ) });
          
          res.send({
            speech : `You have ${orders.length} orders \n. Would you like to see them ?(yes/no)`
          });
    
        })
        .catch((e) => {
          console.log('error while getting documents', e);
          res.send({
            speech :'something went wrong when reading from database'
          });
        })
      }
      else if (params.password != '****'){
        res.send({
          speech: 'sorry either you are not the admin or your password is wrong'
        });
      }
    break;
      
    default:
      res.send({
        speech: 'No action matched in webhook'
      });
  }
});