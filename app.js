//jshint esversion:6
//Call express framework so we can code more efficient
const express = require("express");
//Call body-parser, so we can parse the data from HTML post request
const bodyParser = require("body-parser");
//Call our own internal module for getting currentdate
const date = require(__dirname + "/date.js");

//Run the express
const app = express();

//Basic configuration for using body parser module
app.use(bodyParser.urlencoded({extended: true}));
//So we can call static files (image and css) from public folder
app.use(express.static("public"));
//We're using ejs as a view engine.
app.set("view engine", "ejs");

//Declare array items so we can send it to index.ejs. So it can shows several list items.
//We seperate it into 2 array, 1 for / route, 1 for /work route.
const listItems = ["Jajan", "Belanja", "Tidur"];
const workingItems = [];

//Serve / page route
app.get("/", function(req, res) {

  //Call function getdate from date.js module
  let today = date.getDate();
  //Open file index.ejs that's in Views folder (that contains HTML and variable that we can change from this app.js)
  //Send the variable.
  res.render("index", {pageTitle: today, listItemsText: listItems});
});

//Serve /work page route
app.get("/work", function(req, res) {
  //Open file index.ejs that's in Views folder (that contains HTML and variable that we can change from this app.js)
  //Send the variable.
  res.render("index", {pageTitle: "Work", listItemsText: workingItems});
});

// Catch post request, then do some actions
app.post("/", function(req, res) {
  //Getting property value from button. For later filtering purpose
  const buttonValue = req.body.button;
  //catch recent item created
  let newItem = req.body.newItem;

  //If the post request from Work route (marked by "Work" value from the button)
  if ( buttonValue === "Work") {
    //add new item to the array workingItems, then redirect to /work route
    workingItems.push(newItem);
    res.redirect("/work");
  } else { //if the post request not from /work, then it must be from /
    //add new item to the array listItems, then redirect to / route
    listItems.push(newItem);
    res.redirect("/");
  };
});

//Run nodejs on port 3000
app.listen(3000, function() {
  console.log("Server is running on Port 3000");
});
