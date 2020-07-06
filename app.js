//jshint esversion:6
//Call express framework so we can code more efficient
const express = require("express");
//Call body-parser, so we can parse the data from HTML post request
const bodyParser = require("body-parser");
//Call our own internal module for getting currentdate
//const date = require(__dirname + "/date.js");
//Call Mongoose
const mongoose = require("mongoose");
const _ = require("lodash");


//Run the express
const app = express();

mongoose.connect("mongodb://localhost:27017/todoDB", {useNewUrlParser: true, useUnifiedTopology: true });


const listsSchema = new mongoose.Schema({
  name: String
});

const List = mongoose.model("List", listsSchema);

const list1 = new List({
  name: "Home",
});

const list2 = new List({
  name: "Work"
});


const defaultLists = [list1, list2];

const itemsSchema = new mongoose.Schema({
  name: String,
  list: listsSchema
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Eat",
  list: list1
});

const item2 = new Item({
  name: "Walking",
  list: list1
});

const item3 = new Item({
  name: "Sleep",
  list: list1
});

const defaultItems = [item1, item2, item3];

Item.countDocuments({}, function(err, count){
  if (count===0) {
    Item.insertMany(defaultItems, function(err) {
       if (!err) {
         console.log("No documents. Add default items success!");
       } else {
         console.log(err);
       }
     });
  } else {
    console.log("There are " + count + " documents, no need to create default items");
  }
});

List.countDocuments({}, function(err, count) {
  if (count===0) {
    List.insertMany(defaultLists, function(err){
      if (!err) {
        console.log("No Lists. Add default lists success!");
      } else {
        console.log(err);
      }
    });
  } else {
    console.log("There are " + count + " lists, no need to create new lists");
  };
});


//Basic configuration for using body parser module
app.use(bodyParser.urlencoded({extended: true}));
//So we can call static files (image and css) from public folder
app.use(express.static("public"));
//We're using ejs as a view engine.
app.set("view engine", "ejs");


//Serve / page route
app.get("/", function(req, res) {

  List.find({}, function(err, foundLists){
    Item.find({}, function(err, foundItems){
        res.render("index", {listsText: foundLists, itemsText: foundItems});
    });
  });

});

app.get("/list/:listId", function(req, res){
  // const searchListName = req.params.listname;
  const searchListId = req.params.listId;

  List.findById({ _id: searchListId }, function(err, foundList){
    Item.find({ list: foundList }, function(err, foundItems){
      const dummyItem = {
        _id: "abc"
      };
      const emptyItem = [];

      if (!err) {
        res.render("list", {listText: foundList, itemsText: foundItems, itemUpdate: dummyItem});
      } else {
        res.render("list", {listText: foundList, itemsText: emptyItem, itemUpdate: dummyItem});
      };

    });
  });

});

app.get("/update/list/:listId/item/:itemId", function(req, res){
  const searchListId = req.params.listId;
  const searchItemId = req.params.itemId;

  List.findById({ _id: searchListId }, function(err, foundList){
    Item.find({ list: foundList }, function(err, foundItems){
      Item.findOne({ _id: searchItemId }, function(err, foundItem){
          res.render("list", {listText: foundList, itemsText: foundItems, itemUpdate: foundItem});
      });
    });
  });
});


// Catch post request, then do some actions
app.post("/", function(req, res) {
  //Getting property value from button. For later filtering purpose
  const listId = req.body.createItem;
  //catch recent item created
  const itemName = req.body.newItem;

  List.findById(listId, function(err, foundList){

    const item = new Item({
      name: itemName,
      list: foundList
    });

    item.save();
    console.log("Add item success!");
    res.redirect("/list/" + listId);
  });

});

app.post("/delete", function(req, res) {
  const itemId = req.body.checkbox;
  const listId = req.body.listIdInput;

  Item.deleteOne({ _id: itemId }, function(err) {
    if (!err) {
      console.log("Delete item success!");
      res.redirect("/list/" + listId);
    } else {
      console.log(err);
    }
  });


});


app.post("/checkupdateitem", function(req, res){
  const itemId = req.body.itemIdInput;
  const listId = req.body.listIdInput;

  res.redirect("/update/list/" + listId + "/item/" + itemId);
});

app.post("/updateitem", function(req, res){
  const itemId = req.body.itemIdInput;
  const newItemName = req.body.inputName;
  const listId = req.body.listIdInput;

  Item.updateOne({ _id: itemId }, { name: newItemName}, function(err){
    if (!err) {
      console.log("Update item success");
      res.redirect("/list/" + listId);
    } else {
      console.log(err);
    };
  });
});


app.post("/seelist", function(req, res) {
  const listId = req.body.seeList;
  res.redirect("/list/" + listId);


  // List.findById({_id: listId}, function(err, foundList){
  //   const kebabListName = _.kebabCase(foundList.name);
  //   res.redirect("/list/" + kebabListName);
  // });

});



app.post("/createlist", function(req, res){
  const listName = req.body.newList;

  const newList = new List({
    name: listName
  });

  newList.save();
  res.redirect("/");
});

//Run nodejs on port 3000
app.listen(3000, function() {
  console.log("Server is running on Port 3000");
});
