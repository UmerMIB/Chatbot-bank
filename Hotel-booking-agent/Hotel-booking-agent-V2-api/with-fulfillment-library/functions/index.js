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
                agent.add(`${params.name} your hotel booking request for ${params.roomType} room is forwarded 
                        for ${params.persons} persons . We will contact you on ${params.email} soon`);
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

    function feedBack(agent) {
        let params = agent.parameters;
        return firestore.collection(` FeedBack `).add(params)
            .then(() => {
                return agent.add(`Your ${params.feedBack} has been recorded. We will try to make better
                        decision on your ${params.feedBack}. Thank you`);
            })
            .catch((e => {
                console.log(`Error`, e);
                agent.add(`Something went wrong while writing on database`);
            }))
    }

    let intentMap = new Map;
    intentMap.set(`Hotel_booking`, Hotel_booking);
    intentMap.set(`countBookings`, countBookings);
    intentMap.set(`feedBack`, feedBack);

    _agent.handleRequest(intentMap);
});


