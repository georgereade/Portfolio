//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.set('views', '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("projects/Hosted-To-Do-List/public/"));

mongoose.connect("mongodb+srv://georgereade:4qukbxLI5VTglpmP@cluster0.brh6cuj.mongodb.net/todolistDB", {useNewUrlParser:true});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema); 

const item1 = new Item({
  name: "Go to the shop"
});

const item2 = new Item({
  name: "Go to the dead"
});

const item3 = new Item({
  name: "Go to the kill"
});

const defaultItems = [item1,item2,item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  Item.find({}).then(function(foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems)
      .then(function(){
      console.log("Success");
    })
      .catch(function(err){
      console.log(err);
    });
    } else {
    res.render("list", {listTitle: "Today", newListItems: foundItems });
    }
  })
    .catch(function(err){
      console.log(err);
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item ({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect('/');
  } else {
    List.findOne({name: listName})
    .then(function(foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
    .catch(function(err){
      console.log(err);
    })
  }
});

app.post("/delete", function(req, res){
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndDelete(checkedItemID)
    .then(function(){
      res.redirect('/');
    })
    .catch(function(err){
      console.log(err);
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull:{items:{_id:checkedItemID}}})
    .then(function(){
      res.redirect('/'+listName);
    })
    .catch(function(err){
      if(!err){
        res.redirect('/'+listName);
      }
    }
    )}
});

app.get('/:customListName', function(req,res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName})
  .then(function(foundList){

    if (!foundList){
    const list = new List({
      name: customListName,
      items: []
    });

    list.save();
    res.redirect('/'+customListName);
  }

  else {
    res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
  }

  })
  .catch(function(err){
    console.log(err);
  });
});

app.listen(PORT, function() {
  console.log(`Server started on ${PORT}`);
});
