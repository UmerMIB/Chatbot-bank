// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
var db = admin.initializeApp();
const { WebhookClient } = require('dialogflow-fulfillment');
process.env.DEBUG = "dialogflow:debug";

exports.webhook = functions.https.onRequest((request, response) => {
    const _agent = new WebhookClient({ request, response });

    //let params = req.body.queryResult.parameters;
    //let actions = req.body.queryResult.action;

    function main(agent) {

        let params = agent.parameters;
        let operation = agent.parameters['operation'];
        let number1 = agent.parameters['number1'];
        let number2 = agent.parameters['number2'];

        switch (params.operation) {
            case "Addition":
                agent.add(` The ${operation} of ${number1}
                and ${number2} is ${number1 + number2} `
                );
                break;


            case "Subtraction":
                agent.add(` The ${operation} of ${number1}
                and ${number2} is ${number1 - number2} `
                );
                break;

            case "Multiplication":
                agent.add(` The ${operation} of ${number1}
                and ${number2} is ${number1 * number2} `
                );
                break;

            case "Division":
                if (params.number2 !== 0) {
                    agent.add(` The ${operation} of ${number1}
                    and ${number2} is ${number1 / number2} `
                    );
                }
                else {
                    agent.add(`Sorry, this calculator can't perform calculation of divident with 0 `
                    );
                }
                break;
            default:
                agent.add('Sorry we only can only perform ADDITION SUBTRACTION MULTIPLICATION AND DIVISION'
                );
        }

    }

    let intents = new Map();
    intents.set('All-In-One', main);
    intents.set('additional-feature', main);

    _agent.handleRequest(intents);

});
