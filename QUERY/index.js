const express=require("express");
const cors=require('cors');
const axios=require("axios")
const bodyParser=require('body-parser')
const app=express();


app.use(bodyParser.json());
app.use(cors());

const posts={}


app.get("/events",(req,res)=>{
    res.status(200).json(posts)
})

app.post("/events",async(req,res)=>{
    const event=req.body;
    console.log(event.type)
    if(event.type==="PostCreated"){
          const {id,title}=event.data;

          posts[id]={id,title,comments:[]}
    }
    
    if(event.type==="CommentCreated"){
          const {id,contents,postId,status}=event.data;
          posts[postId].comments.push({id,contents,status})
    }

    if(event.type==="Service"){
        const {id,contents,postId,status}=event.data;
        
        const post=posts[postId].comments.find((i)=>{
            return i.id===id
        })
        post.status=status

        await axios.post("http://localhost:4000/events",{
            type:"CommentUpdated",
            data:{
                id,
                contents,
                postId,
                status,
            }
        })

  }


    res.send("recieved")
})



app.listen(4005,()=>{
    console.log("connected to 4005")
})