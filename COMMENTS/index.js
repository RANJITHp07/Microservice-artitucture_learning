const express = require("express");
const axios = require("axios");
const cors=require("cors")
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors())

let commentsByPost = {};

app.get("/posts/:id/comments", (req, res) => {
  res.status(200).json(commentsByPost[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  try {
    const commentId = randomBytes(4).toString("hex");
    const { contents } = req.body;

    const comments = commentsByPost[req.params.id] || [];
    const newComment = { id: commentId, contents, status: "pending" };

    comments.push(newComment);
    commentsByPost[req.params.id] = comments;

    await axios.post("http://localhost:8000/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        contents,
        postId: req.params.id,
        status: "pending",
      },
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/events", async (req, res) => {
  console.log("Received event:", req.body.type);
  const event = req.body;
  if (event.type === "CommentUpdated") {
    const { id, contents, postId, status } = event.data;

    const comments = commentsByPost[postId];
    if (comments) {
      const comment = comments.find((c) => c.id === id);
      if (comment) {
        comment.status = status;
        console.log(comment);
      }
    }
  }
  res.send({});
});

app.listen(4000, () => {
  console.log("Connected successfully to port 4000");
});
