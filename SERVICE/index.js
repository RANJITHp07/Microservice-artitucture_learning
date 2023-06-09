const express=require("express");
const axios=require("axios")
const bodyParser=require("body-parser")
const app=express();


app.use(bodyParser.json());

app.post("/events",async(req,res)=>{
    const event=req.body
      if(event.type==="CommentCreated"){
         const status=event.data.contents.includes("orange") ? "rejected":"approved";
         console.log(status)
         await axios.post("http://localhost:8000/events",{
            type:"Service",
            data:{
            id:event.data.id,
            contents:event.data.contents,
            postId:event.data.postId,
            status:status 
            }
         })
      }
      res.send({})
})

app.listen(6000,()=>{
    console.log("connected to 6000")
})