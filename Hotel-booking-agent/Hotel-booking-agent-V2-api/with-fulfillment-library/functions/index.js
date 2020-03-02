const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp();
const { WebhookClient } = require('dialogflow-fulfillment');
process.env.DEBUG = "dialogflow:debug"
var firestore = admin.firestore();

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const _agent = new WebhookClient({ request, response });

    function Hotel_booking(agent) {
        console.log(`agent.parameters`, agent.parameters);
        let params = agent.parameters;
        return firestore.collection(`orders`).add(params)
            .then((d) => {
                agent.add(`${params.name} your hotel booking request for ${params.roomType} room for ${params.persons} persons on date ${params.date} for ${params.duration.amount} ${params.duration.unit} is forwarded . We will contact you on ${params.email} soon`);
                return console.log("save data is : ", d)
            })
            .catch((e => {
                console.log(`Error `, e);
                agent.add(`Something went wrong while writing on database`);
            }))

    }

    function countBookings(agent) {
        let params = agent.parameters;
        if (params.password === admin) {
            return firestore.collection(`orders`).get()
                .then((QuerySnapshot) => {
                    var orders = [];
                    QuerySnapshot.forEach((doc) => { orders.push(doc.data()) });
                    return agent.add(` you have ${orders.length} orders , would you like to see them ?
                            press yes `);
                })
                .catch((e => {
                    console.log(`Error `, e);
                    agent.add(` Something went wrong while reading from database `);
                }))
        }
    }

    function showBookings(agent) {
        let params = agent.parameters;
        return firestore.collection(`orders`).get()
            .then((QuerySnapshot) => {
                var orders = [];
                QuerySnapshot.forEach((doc) => { orders.push(doc.data()) });
                var list = `Here are your orders \n`;
                list.forEach((eachOrder, index) => {
                    list += ` \n number ${index + 1} is ${eachOrder.roomType} room for ${eachOrder.persons} persons is ordered by 
                ${eachOrder.name} contact email is ${eachOrder.email} \n `
                });
                return agent.add(` ${list}`);
            })
            .catch((e => {
                console.log(`Error `, e);
                agent.add(` Something went wrong while reading from database `);
            }))
    }

    function feedback(agent) {
        let params = agent.parameters;
        return firestore.collection(` FeedBack `).add(params)
            .then(() => {
                return agent.add(`Your ${params.subject} has been recorded. We will try to make better
                        decision on your ${params.subject}. Thank you`);
            })
            .catch((e => {
                console.log(`Error`, e);
                agent.add(`Something went wrong while writing on database`);
            }))
    }

    function DefaultFallbackIntent(agent) {
        // console.log(`query text from library is ${agent.queryText}`);
        // console.log(`query text request.body is ${request.body.queryResult.queryText}`);
        return firestore.collection('Invalid statements').add({ "statement": request.body.queryResult.queryText })
            .then(() => {
                return agent.add(`I didnot understand what you said I can book hotel
             and can accept your feedback `)
            })
            .catch((e => {
                console.log('error', e);
                return agent.add("something went wrong when writing on database")
            }))
    }

    let intentMap = new Map;
    intentMap.set(`Hotel_booking`, Hotel_booking);
    intentMap.set(`countBookings`, countBookings);
    intentMap.set(`feedback`, feedback);
    intentMap.set(`Default Fallback Intent`, DefaultFallbackIntent);

    _agent.handleRequest(intentMap);
});
