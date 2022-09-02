import express from "express";
import morgan from "morgan";
import { WebhookClient } from 'dialogflow-fulfillment';
import bodyParser from "body-parser";
import twilio from "twilio";


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(morgan("dev"));
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);

});
// ab iska route ka through hum dialog flow sa  request mangwara ha

// https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook
// https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook#webhook-nodejs
app.post("/webhook", (request, response) => {
  const _agent = new WebhookClient({ request, response });
  // const _agent = new WebhookClient({req,res});

  function welcome(agent) {
    agent.add(`Welcome to my Pizza shop!`);
  }

  function order(agent) {

    const pizzaFlavors = agent.parameters.pizzaFlavors;
    const qty = agent.parameters.qty;
    const PizzaSize = agent.parameters.PizzaSize;

    console.log("qty=>", qty);
    console.log("PizzaSize=>", PizzaSize);
    console.log("pizzaFlavors=>", pizzaFlavors);

    agent.add(`Response from server, here is your order for ${qty} ${PizzaSize} ${pizzaFlavors} pizza.Your order is placed successfully!`);


  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('PlaceOrder', order);
  intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  _agent.handleRequest(intentMap);
});

app.post("/twiliowebhook", (req, res, next) => {

   console.log("twiliowebhook");
  console.log(req.body);

  console.log("message: ", req.body.Body);
  let twiml = new twilio.twiml.MessagingResponse()
  twiml.message('Hello welcome to my pizza shop!');

  // // // todo: call dialogflow

  res.header('Content-Type', 'text/xml');
  res.send(twiml.toString());
   

  
 










});


