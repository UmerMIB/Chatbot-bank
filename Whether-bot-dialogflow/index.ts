const apiKey =a7cbb97f5c95d2142229b9de277746d7;
const request = require('request');
const {WebhookClient} = require('dialogflow-fulfillment');
const express = require(' express ');
const bodyParser = require('body-parser');
const app = express.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

process.env.DEBUG = 'dialogflow:*';

app.post('/webhook', function(request,response){
    const _agent = new WebhookClient ({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  function humidity( agent) {
    console.log(`context are: `, request.body.queryResult.outputContexts);
    var cityContext = agent.context.get(`cityContext`);
    var cityName;
    if (agent.parameters.city){
      cityName = agent.parameters.city;
    }else if(cityContext.parameters.geo-city){
      cityName = cityContext.parameters.geo-city;
    }else{
      console.log(`City name is not provided`);
      agent.add(`please mention city name `);
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    request(url, (error,response, body )=>{
      if (error){
        console.log(`Error while calling api`);
        agent.add(`Something went wrong while getting the information from External source`);
      }
      let weather  = JSON.parse(body);
      console.log(`whether is: \n ${weather}`);
      agent.context.set({
        'name':'cityContext',
        'lifespan': 5,
        'parameters':{
          'geo-city':cityName,
          }
      });
      agent.add(new Card ({
          title : `Whether Update`,
          imageURL: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwFfMsIQfjNUeY2QlP7bh9rT2HpXWwHQkRm_pv73oC7AePtidMkA`,
          text : `The humidity in ${cityName} is ${weather.main.humidity}% `
        })
      );
    }
 }
 function rain(agent){

 }
  
 function weather(agent){
  
 }

 function temperature(agent){

 }

 function wind(agent){

 }



 let intentMap = new Map();
 intentMap.set(`humidity`, humidity);
 intentMap.set(`rain`, rain);
 intentMap.set(`weather`, weather);
 intentMap.set(`temperature`, temperature);
 intentMap.set(`wind`, wind);
})
