const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require ('express');
const {WebhookClient} = require('dialogflow-fulfillment');
process.env.DEBUG = 'dialogflow:debug';
const port = process.env.PORT || 5000;
const app = express().use(bodyParser.json());

require('./mongoose');   // Database
require('./model/post'); // Schema

var model = mongoose.model('ReqData');

app.post ('/webhook', (request, response, next)=>{
    console.log(`In comes a request `, request.url);
    const _agent = new WebhookClient({ request: request, response: response });

    let intent  = agent.intent.displayName;
    switch(intent) {
        case 'Hotel_booking':
            hotel_booking(request,response)
            break;

        // case 'Default Welcome Intent':
        //     welcome(request, response)
        //     break
        default :
        console.log(`Intent doesnot match`);
        agent.add(`Sorry we can't your request please follow directed way Thanks`)

    }

    function hotel_booking(req, res) {
        console.log(`In comes a request `, req.url);
        let name  = agent.parameters.name;
        let persons  = agent.parameters.persons;
        let roomType  = agent.parameters.roomType;
        let email  = agent.parameters.email;
        let data = {
            name:name,
            persons:persons,
            roomType:roomType,
            email:email

        }
        var saveData =new  model(data);
        saveData.save((err, mydata)=>{
            if (err){
                console.log(`Error occured while writing on database`, err);
                agent.add(`Error occured while writing on database`);
            }
            else{
                console.log(`Data is `, mydata);
                agent.add(`Your request for ${persons} persons for ${ roomType} room is recorded.
                ${name} We'll contact you soon on this email ${email} `)
            }
        });
    };
    
    


});







app.listen(port ,()=>{
    console.log(`Server is running on port ${port}`)
})