import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
  });

app.get("/worklist", (req,res) => {
  res.render("worklist.ejs", {worktodo : workToDoList, funtodo : funToDoList});
})

app.get("/funlist", (req,res) => {
  res.render("funlist.ejs", {worktodo : workToDoList, funtodo : funToDoList});
})

const workToDoList = [];
const funToDoList = [];

app.post("/submit", (req, res) => {
  const newToDo = req.body.task;
  if (req.body.worktask === "Add Work Task") {
    workToDoList.push(newToDo);
    res.render("worklist.ejs", {worktodo : workToDoList, funtodo : funToDoList})
  } else if (req.body.funtask === "Add Fun Task") {
    funToDoList.push(newToDo);
    res.render("funlist.ejs", {worktodo : workToDoList, funtodo : funToDoList})
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});