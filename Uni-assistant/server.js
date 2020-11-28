require("datejs");
const express = require("express");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const { WebhookClient } = require("dialogflow-fulfillment");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const dialogflow = require("dialogflow");
const languageCode = "en";
const projectId = "uni-assistant-b9wr";
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const sessionId = uuidv4();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("build"));
app.use(bodyParser.urlencoded({ extended: false }));

process.env.DEBUG = "dialogflow:debug*";

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "./keys/serviceKeys.json",
});

app.get("/get-response", (req, res) => {
  console.log(`request parameter received`, req.query);
  let query = req.query.query ? req.query.query : undefined;

  async function detectQueryIntent(projectId, sessionId, query, languageCode) {
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
    };
    const responses = await sessionClient.detectIntent(request);
    var fulfillmentMessages = responses[0].queryResult.fulfillmentMessages;
    res.send(fulfillmentMessages);
    console.log("Detected intent");
    const result = responses[0].queryResult;
    console.log("res is : ", responses[0].queryResult.fulfillmentMessages);
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
  }
  detectQueryIntent(projectId, sessionId, query, languageCode);
});

app.post("/webhook", function (request, response) {
  var _agent = new WebhookClient({ request: request, response: response });

  function name(agent) {
    console.log(`agent`, agent.parameters.name.name)
    let name = agent.parameters.name.name.toUpperCase();
    var date = new Date().toString("HH");
    if (date >= 5 && date <= 11) {
      agent.add(`Good Morning ${name} Ask me a question. I’m here to help you`);
    } else if (date >= 12 && date <= 16) {
      agent.add(`Good Afternoon ${name} Ask me a question. I’m here to help you`);
    } else {
      agent.add(`Good Evening ${name} Ask me a question. I’m here to help you`);
    }
    agent.add(new Suggestion('courses'));
    agent.add(new Suggestion('LMS login'));
    agent.add(new Suggestion('Contact Us'));

  }

  function login(agent) {
    agent.add(`For login into your account please visit the url below`);
    agent.add(
      new Card({
        title: "Login",
        buttonText: "Login portal",
        buttonUrl: "https://e-learning.vit.edu.au/login/login_sso.php",
      })
    );
  }

  function courses(agent) {
    agent.add("Right now VIT is offering courses in various programs.");
    agent.add("Please select any one of the options below ");
    agent.add(new Suggestion("All Courses"));
    agent.add(new Suggestion("Higher Education"));
    agent.add(new Suggestion("Vocational Training"));
    agent.add(new Suggestion("Short Courses"));
    agent.add(new Suggestion("EAP and General English Course"));
  }

  function allCourses(agent) {
    agent.add("To see all courses please visit this webpage ");
    agent.add(
      new Card({
        title: "All Courses",
        buttonText: "All Courses",
        buttonUrl: "https://www.vit.edu.au/courses/",
      })
    );
  }

  function higherEducation(agent) {
    agent.add("VIT is offering following programs for Higher Education");
    agent.add(
      new Suggestion("Master of Information Technology And Systems (MITS)")
    );
    agent.add(new Suggestion("Master of Business Administration (MBA)"));
    agent.add(
      new Suggestion("Bachelor of Information Technology And Systems (BITS)")
    );
  }
  //Higher education
  function MITS(agent) {
    agent.add("Below is the MITS program offering in VIT ");

    agent.add(
      new Card({
        title: "MITS",
        buttonText: "Master of Information Technology And Systems (MITS)",
        buttonUrl:
          "https://www.vit.edu.au/courses/master-of-information-technology-and-systems-mits/",
      })
    );
  }

  function MBA(agent) {
    agent.add("Below is the MBA program offering in VIT ");

    agent.add(
      new Card({
        title: "MBA",
        buttonText: "Master of Business Administration (MBA)",
        buttonUrl:
          "https://www.vit.edu.au/courses/master-of-business-administration-mba/",
      })
    );
  }

  function BITS(agent) {
    agent.add("Below is the Bachelor program offering in VIT ");
    agent.add(
      new Card({
        title: "BITS",
        buttonText: "Bachelor of Information Technology And Systems (BITS)",
        buttonUrl:
          "https://www.vit.edu.au/courses/bachelor-of-information-technology-and-systems-bits/",
      })
    );
  }
  ///

  function vocationalTraining(agent) {
    agent.add("VIT is offering following vocational trainings");
    agent.add(
      new Card({
        title: "Vocational Training",
        buttonText: "Diploma of Information Technology Networking",
        buttonUrl:
          "https://www.vit.edu.au/courses/diploma-of-information-technology-networking/",
      })
    );
    agent.add(
      new Card({
        title: "Vocational Training",
        buttonText: "Advanced Diploma of Hospitality Management",
        buttonUrl:
          "https://www.vit.edu.au/courses/advanced-diploma-of-hospitality-management/",
      })
    );
    agent.add(
      new Card({
        title: "Vocational Training",
        buttonText: "Certificate III in Carpentry",
        buttonUrl:
          "https://www.vit.edu.au/courses/certificate-iii-in-carpentry/",
      })
    );
    agent.add(
      new Card({
        title: "Vocational Training",
        buttonText: "Certificate III in Commercial Cookery",
        buttonUrl:
          "https://www.vit.edu.au/courses/certificate-iii-in-commercial-cookery/",
      })
    );
    agent.add(
      new Card({
        title: "Vocational Training",
        buttonText: "Certificate III in Patisserie",
        buttonUrl:
          "https://www.vit.edu.au/courses/certificate-iii-in-patisserie/",
      })
    );
    agent.add(
      new Card({
        title: "Vocational Training",
        buttonText: "Certificate IV in Commercial Cookery",
        buttonUrl:
          "https://www.vit.edu.au/courses/certificate-iv-in-commercial-cookery/",
      })
    );
    agent.add(
      new Card({
        title: "Vocational Training",
        buttonText: "Certificate IV in Patisserie",
        buttonUrl:
          "https://www.vit.edu.au/courses/certificate-iv-in-patisserie/",
      })
    );
    agent.add(
      new Card({
        title: "Vocational Training",
        buttonText: "Diploma of Hospitality Management",
        buttonUrl:
          "https://www.vit.edu.au/courses/diploma-of-hospitality-management/",
      })
    );
  }

  function informationTechnology(agent) {
    agent.add("VIT is offering a Diploma in Information Technology Networking");
    agent.add(
      new Card({
        title: "Vocational Training",
        buttonText: "Diploma of Information Technology Networking",
        buttonUrl:
          "https://www.vit.edu.au/courses/diploma-of-information-technology-networking/",
      })
    );
  }

  function hospitality(agent) {
    agent.add("We are offering diploma and advance diploma in hospitality");
    agent.add(
      new Card({
        title: "Vocational Training",
        buttonText: "Diploma of Hospitality Management",
        buttonUrl:
          "https://www.vit.edu.au/courses/diploma-of-hospitality-management/",
      })
    );
    agent.add(
      new Card({
        title: "Vocational Training",
        buttonText: "Advanced Diploma of Hospitality Management",
        buttonUrl:
          "https://www.vit.edu.au/courses/advanced-diploma-of-hospitality-management/",
      })
    );
  }

  function EAPAndGeneralEnglish(agent) {
    agent.add("VIT is offering following EAP and General English Courses");
    agent.add(
      new Card({
        title: "EAP And General English",
        buttonText: "English for Academic Purposes Program (EAP) Information",
        buttonUrl:
          "https://www.vit.edu.au/courses/english-for-academic-purposes-program-eap-information/",
      })
    );
    agent.add(
      new Card({
        title: "EAP And General English",
        buttonText: "General English Information",
        buttonUrl:
          "https://www.vit.edu.au/courses/general-english-information/",
      })
    );
    agent.add(
      new Card({
        title: "EAP And General English",
        buttonText: "IELTS Preparation (Academic)",
        buttonUrl: "https://www.vit.edu.au/courses/ielts-preparation-academic/",
      })
    );
  }

  function shortCourses(agent) {
    agent.add(
      "For information about short courses please select anyone of the following options"
    );
    agent.add(new Suggestion("All Short Courses"));
    agent.add(new Suggestion("Programming"));
    agent.add(new Suggestion("Multimedia"));
    agent.add(new Suggestion("Professional Certification Training IT"));
  }

  function allShortCourses(agent) {
    agent.add("To see all courses please visit this webpage ");
    agent.add(
      new Card({
        title: "All Short Courses",
        buttonText: "All Short Courses",
        buttonUrl: "https://www.vit.edu.au/short-courses/",
      })
    );
  }

  function programming(agent) {
    agent.add("VIT is offering following programming courses");
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "ASP.NET Programming (using Visual C#)",
        buttonUrl:
          "https://www.vit.edu.au/courses/asp-net-programming-using-visual-c/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "C++",
        buttonUrl: "https://www.vit.edu.au/courses/c/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "Fundamentals of XML",
        buttonUrl: "https://www.vit.edu.au/courses/fundamentals-of-xml/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "HTML | Level 1| Beginners",
        buttonUrl:
          "https://www.vit.edu.au/courses/html-programming-level-1-for-beginners/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "HTML | Level 2 | Advanced",
        buttonUrl: "https://www.vit.edu.au/courses/html-level-2-advanced/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "Introduction To Cascading Style Sheets",
        buttonUrl:
          "https://www.vit.edu.au/courses/introduction-to-cascading-style-sheets/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "Java 2.0",
        buttonUrl: "https://www.vit.edu.au/courses/java-2-0/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "Java Server Pages",
        buttonUrl: "https://www.vit.edu.au/courses/java-server-pages/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "JavaScript",
        buttonUrl: "https://www.vit.edu.au/courses/javascript/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "PHP",
        buttonUrl: "https://www.vit.edu.au/courses/php/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "SQL | Database",
        buttonUrl: "https://www.vit.edu.au/courses/sql-database/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "Visual Basic 2015",
        buttonUrl: "https://www.vit.edu.au/courses/visual-basic-2015/",
      })
    );
    agent.add(
      new Card({
        title: "Programming",
        buttonText: "Visual C#.NET using Microsoft Visual Studio 2015",
        buttonUrl:
          "https://www.vit.edu.au/courses/visual-c-net-using-microsoft-visual-studio-2015/",
      })
    );
  }

  function multimedia(agent) {
    agent.add("VIT is offering following multimedia courses");
    agent.add(new Suggestion('Adobe Acrobat Pro DC'));
    agent.add(new Suggestion('Adobe After Effects Pro CC'));
    agent.add(new Suggestion('Adobe Dreamweaver CC'));

    agent.add(new Suggestion("Show more"));
  }
  function multimediaMore(agent) {
    agent.add(new Suggestion('Adobe Flash Professional CC'));
    agent.add(new Suggestion('Adobe Illustrator CC'));
    agent.add(new Suggestion('Adobe InDesign CC'));
    agent.add(new Suggestion("Show more"));
  }
  function multimediaMoreMore(agent) {
    agent.add(new Suggestion('Adobe Photoshop CC'));
    agent.add(new Suggestion('Adobe Premiere Pro CC'));
    agent.add(new Suggestion('Autodesk 3d Max 2017'));
  }

  function adobeAcrobatProDC(agent) {
    agent.add("VIT is offering following Adobe Acrobat Pro CC courses");
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Acrobat Pro DC – Level 1 | beginners",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-acrobat-pro-dc-level-1-beginners/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Acrobat Pro DC – Level 2 | Intermediate",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-acrobat-pro-dc-level-2-intermediate/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Acrobat Pro DC – Level 3 | Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-acrobat-pro-dc-level-3-advanced/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Acrobat Pro DC | Basic To Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-acrobat-pro-dc-basic-to-advanced/",
      })
    );
  }

  function adobeAfterEffectsCC(agent) {
    agent.add(
      "Currently VIT is offering following Adobe After Effects CC courses"
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe After Effects CC – Level 1 | Beginners",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-after-effects-cc-level-1-beginners/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe After Effects CC – Level 2 | Intermediate",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-after-effects-cc-level-2-intermediate/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe After Effects CC – Level 3 | Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-after-effects-cc-level-3-advanced/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe After Effects CC | Basic – Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-after-effects-cc-basic-advanced/",
      })
    );
  }

  function adobeDreamweaverCC(agent) {
    agent.add(
      "Currently VIT is offering following Adobe Dreamweaver CC courses"
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Dreamweaver CC – Basic To Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-dreamweaver-cc-basic-to-advance/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Dreamweaver CC – Level 2 | Intermediate",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-dreamweaver-cc-level-2/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Dreamweaver CC – Level 3 | Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-dreamweaver-cc-level-3/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Dreamweaver CC- Level 1 | Basic",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-dreamweaver-cc-level-1/",
      })
    );
  }

  function adobeFlashProfessionalCC(agent) {
    agent.add(
      "Currently VIT is offering following Adobe Flash Professional CC courses"
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Flash Professional CC – Basic to Advance",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-flash-professional-cc-basic-to-advance/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Flash Professional CC – Level 1 | Basic",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-flash-professional-cc-level-1/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Flash Professional CC – Level 2 | Intermediate",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-flash-professional-cc-level-2/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Flash Professional CC – Level 3 | Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-flash-professional-cc-level-3/",
      })
    );
  }

  function adobeIllustratorCC(agent) {
    agent.add(
      "Currently VIT is offering following Adobe Illustrator CC courses"
    );

    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Illustrator CC – Basic To Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-illustrator-cc-basic-to-advanced/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Illustrator CC – Level 1| Beginners",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-illustrator-cc-level-1-beginners/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Illustrator CC – Level 2 | Intermediate",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-illustrator-cc-level-2-intermediate/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Illustrator CC – Level 3 | Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-illustrator-cc-level-3-advanced/",
      })
    );
  }

  function adobeInDesignCC(agent) {
    agent.add("Currently VIT is offering following Adobe InDesign CC courses");

    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe InDesign CC | Basic To Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-indesign-cc-basic-to-advanced/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe InDesign CC | Level 1| Beginners",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-indesign-cc-level-1-beginners/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe InDesign CC | Level 2 | Intermediate",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-indesign-cc-level-2-intermediate/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe InDesign CC | Level 3 | Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-indesign-cc-level-3-advanced/",
      })
    );
  }

  function adobePhotoshopCC(agent) {
    agent.add("Currently VIT is offering following Adobe Phootshop CC courses");

    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Photoshop CC – Level 1 | Beginners",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-photoshop-cc-level-1-beginners/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Photoshop CC – Level 2 | Intermediate",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-photoshop-cc-level-2-intermediate/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Photoshop CC – Level 3 | Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-photoshop-cc-level-3-advanced/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Photoshop CC | Basics to Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-photoshop-cs-basics-to-advanced/",
      })
    );
  }

  function adobePremiereProCC(agent) {
    agent.add(
      "Currently VIT is offering following Adobe Premiere Pro CC courses"
    );

    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Premiere Pro CC | Level 1 | Beginners",
        buttonUrl: "https://www.vit.edu.au/courses/level-1-beginners/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Premiere Pro CC | Level 2 | Intermediate",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-premiere-pro-cc-level-2-intermediate/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Adobe Premiere Pro CC | Level 3 | Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/adobe-premiere-pro-cc-level-3-advanced-3/",
      })
    );
  }

  function autoDesk3dMax2017(agent) {
    agent.add(
      "Currently VIT is offering following Auto Desk 3D Max 2017 courses"
    );

    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Autodesk 3ds Max 2017 – Basic To Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/autodesk-3ds-max-2017-basic-to-advanced/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Autodesk 3ds Max 2017 | Level 1| Beginners",
        buttonUrl:
          "https://www.vit.edu.au/courses/autodesk-3ds-max-2017-level-1-beginners/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Autodesk 3ds Max 2017 | Level 2| Intermediate",
        buttonUrl:
          "https://www.vit.edu.au/courses/autodesk-3ds-max-2017-level-2-intermediate/",
      })
    );
    agent.add(
      new Card({
        title: "Multimedia",
        buttonText: "Autodesk 3ds Max 2017 | Level 3 | Advanced",
        buttonUrl:
          "https://www.vit.edu.au/courses/autodesk-3ds-max-2017-level-3-advanced/",
      })
    );
  }

  function professionalCertificationIT(agent) {
    agent.add("VIT is offering the following Professional Certification in IT");
    agent.add(
      new Card({
        title: "Professional Certification IT",
        buttonText: "CCNA Routing and Switching",
        buttonUrl: "https://www.vit.edu.au/courses/ccna-routing-and-switching/",
      })
    );
    agent.add(
      new Card({
        title: "Professional Certification IT",
        buttonText: "CCNP Routing and Switching",
        buttonUrl: "https://www.vit.edu.au/courses/ccnp-routing-and-switching/",
      })
    );
  }

  function downloadForms(agent) {
    agent.add('All forms are available at this webpage')
    agent.add(
      new Card({
        title: "Download Forms",
        buttonText: "Forms",
        buttonUrl: "https://www.vit.edu.au/downloads/",
      })
    );
  }

  
  function mobileApps(agent) {
    agent.add('All VIT associated mobile apps are available at the following link');
    agent.add(
      new Card({
        title: "Mobile Apps",
        buttonText:
          "Mobile Apps (Learning and Support)",
        buttonUrl: "https://www.vit.edu.au/mobile-app-learning/",
      })
    );
  }

  function masters(agent) {
    agent.add("VIT is offering following Masters programs");
    agent.add(
      new Suggestion("Master of Information Technology And Systems (MITS)")
    );
    agent.add(new Suggestion("Master of Business Administration (MBA)"));
  }

  function contactUS(agent){
    agent.add('Please contact us at')
    agent.add('Email: support@vit.edu.au');
    agent.add('Contact: 1300 17 17 55 (Within Australia) (+61) 39670 7848 (Outside Australia)');
    agent.add('WhatsApp: (+61) 406 660 625');
  }

  function enquiries(agent){
    agent.add('All enquiry details are listed here');
    agent.add(new Card({
      title: "Enquiries",
      buttonText:
        "Enquiries",
      buttonUrl: "https://www.vit.edu.au/contact-us/",
    }))
  }

  function defaultCase(agent){
    agent.add(`Sorry, I didn't get that. Can you rephrase?`);
    agent.add(`Or you may select any one of the options below`);
    agent.add(new Suggestion('courses'));
    agent.add(new Suggestion('LMS login'));
    agent.add(new Suggestion('Contact Us')); 
  }

  let intentMap = new Map();
  intentMap.set(`name`, name);
  intentMap.set(`login`, login);

  intentMap.set(`courses`, courses);
  intentMap.set(`all-courses`, allCourses);

  intentMap.set(`higher-education`, higherEducation);
  intentMap.set(`MITS`, MITS);
  intentMap.set(`MBA`, MBA);
  intentMap.set(`BITS`, BITS);

  intentMap.set(`vocational-training`, vocationalTraining);
  intentMap.set(`information-technology`, informationTechnology);
  intentMap.set(`hospitality`, hospitality);

  intentMap.set(`EAP-and-general-english-courses`, EAPAndGeneralEnglish);

  intentMap.set(`short-courses`, shortCourses);
  intentMap.set(`all-short-courses`, allShortCourses);
  intentMap.set(`programming`, programming);
  intentMap.set(`multimedia`, multimedia);
  intentMap.set(`multimedia-more`, multimediaMore);
  intentMap.set(`multimedia-more-more`, multimediaMoreMore);
  intentMap.set(`adobe-acrobat-pro-dc`,adobeAcrobatProDC);
  intentMap.set(`adobe-after-effects-cc`, adobeAfterEffectsCC);
  intentMap.set(`adobe-dreamweaver-cc`, adobeDreamweaverCC);
  intentMap.set(`adobe-flash-professional-cc`,adobeFlashProfessionalCC);
  intentMap.set(`adobe-illustrator-cc`, adobeIllustratorCC);
  intentMap.set(`adobe-indesign-cc`, adobeInDesignCC);
  intentMap.set(`adobe-photoshop-cc`, adobePhotoshopCC);
  intentMap.set(`adobe-premiere-pro-cc`,adobePremiereProCC);
  intentMap.set(`auto-desk-3d-max-2017`, autoDesk3dMax2017);

  intentMap.set(`professional-certification-it`, professionalCertificationIT);

  intentMap.set(`download-forms`, downloadForms);

  // intentMap.set(`student-support`, studentSupport);
  // intentMap.set(`student-welfare-services`, studentWelfareServices);
  // intentMap.set(`student-services`, studentServices);
  // intentMap.set(`student-complaints`, studentComplaints);
  // intentMap.set(`student-payments`, studentPayments);
  // intentMap.set(`microsoft-imagine-academy`, microsoftImagineAcademy);
  intentMap.set(`mobile-apps`, mobileApps);

  intentMap.set(`masters`, masters);

  intentMap.set(`contact-us`, contactUS);
  intentMap.set(`enquiries`, enquiries);

  intentMap.set(`Default Fallback Intent`, defaultCase);

  _agent.handleRequest(intentMap);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);
