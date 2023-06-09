const express = require("express");
const cors = require("cors");
const bodyParser=require("body-parser")
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});

app.post("/posts", async (req, res) => {
  try{
    const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id: id,
    title: title,
  };

  await axios.post("http://localhost:8000/events", {
    type: "PostCreated",
    data:{
      id,
      title
    }
  });

  res.status(201).json(posts[id]);
  }catch(err){
    console.log(err)
  }
  
});

app.post("/events",(req,res)=>{
  console.log("This is my post",req.body.type);
  res.send({})
})

app.listen(5000, () => {
  console.log("Microservice One is running on port 5000");
});
