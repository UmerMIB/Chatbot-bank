// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
var db = admin.initializeApp();

exports.webhook = functions.https.onRequest((req, res) => {
    let params = req.body.queryResult.parameters;
    let actions = req.body.queryResult.action;
    var operation = 'operation';
    var additionalFeature = 'additional-feature';

    if (actions === operation || additionalFeature) {

        switch (params.operation) {
            case "Addition": 
                return res.send({
                    fulfillmentText: ` The ${params.operation} of ${params.number1}
                and ${params.number2} is ${params.number1 + params.number2} `
                });


            case "subtraction": 
                return res.send({
                    fulfillmentText: ` The ${params.operation} of ${params.number1}
                and ${params.number2} is ${params.number1 - params.number2} `
                });
            case "multiplication":
                return res.send({
                    fulfillmentText: ` The ${params.operation} of ${params.number1}
                and ${params.number2} is ${params.number2 * params.number1} `
                });
            case "division":
                if (params.number2 !== 0) {
                    return res.send({
                        fulfillmentText: ` The ${params.operation} of ${params.number1}
                    and ${params.number2} is ${params.number2 / params.number1} `
                    });
                }
                else {
                    return res.send({
                        fulfillmentText: `Sorry, this calculator can't perform calculation of divident with 0 `
                    });
                }
            default:
                return res.send({
                    fulfillmentText: 'Sorry we only can only perform ADDITION SUBTRACTION MULTIPLICATION AND DIVISION'
                });
        }

    }
    else {
        return res.send({
            fulfillmentText: 'Sorry, no operation found for this purpose'
        });
    }
});
