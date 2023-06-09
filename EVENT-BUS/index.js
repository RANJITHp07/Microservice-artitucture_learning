const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/events", async (req, res) => {
  try{
    const event = req.body;

    axios.post("http://localhost:5000/events", event);
    axios.post("http://localhost:4000/events", event);
   axios.post("http://localhost:4005/events", event);
   axios.post("http://localhost:6000/events", event);
   res.status(200).json({ status: "OK" });
  }catch(err){
    console.log(err)
  }
});

app.listen(8000, () => {
  console.log("Microservice Two is running on port 8000");
});
