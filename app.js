//jshint esversion:6
//Panggil express framework supaya ngodingnya lebih singkat
const express = require("express");
//Panggil body-parser, supaya bisa ngambil data dari post request HTML
const bodyParser = require("body-parser");
//Panggil module internal utk dapetin Date dan day
const date = require(__dirname + "/date.js");

//Jalaninj si expressnya
const app = express();

//Supaya bisa parse data HTML dari post requst
app.use(bodyParser.urlencoded({extended: true}));
//Supaya bisa panggil file CSS dan images yang ada di folder public
app.use(express.static("public"));
//Supaya bisa pake ejs framework utk Views. Semua di folder views.
app.set("view engine", "ejs");

//Deklarasikan item array utk dikirim ke ejs, supaya bisa nampilin beberapa list item.
//Dibedakan ada 2, yang 1 untuk halaman route / yang 1 utk route /work
const listItems = ["Jajan", "Belanja", "Tidur"];
const workingItems = [];

//Serve halaman /
app.get("/", function(req, res) {

  //Panggil function getdate dari modul date.js
  let today = date.getDate();
  //Buka file index.ejs yang ada di folder views (yang isinya HTML + variable yg bisa diubah dari app.js ini)
  //Kirim variablenya.
  res.render("index", {pageTitle: today, listItemsText: listItems});
});

//Serve halaman /work
app.get("/work", function(req, res) {
  //Buka file index.ejs yang ada di folder views (yang isinya HTML + variable yg bisa diubah dari app.js ini)
  //Kirim variablenya.
  res.render("index", {pageTitle: "Work", listItemsText: workingItems});
});

// Menangkap post request dan melakukan suatu action
app.post("/", function(req, res) {
  //Dapetin property value dari button. Untuk nanti difilter.
  const buttonValue = req.body.button;
  //tangkap item baru yang dibuat.
  let newItem = req.body.newItem;

  //Kalau value dari button berasal dari page route /work, maka
  if ( buttonValue === "Work") {
    //tambahin item baru ke array yang khusus page route /work lalu redirect ke /work
    workingItems.push(newItem);
    res.redirect("/work");
  } else { //Selain itu, pasti dari halaman /
    //tambahin item baru ke array yang khusus page route / lalu redirect ke /
    listItems.push(newItem);
    res.redirect("/");
  };
});

//Jalankan server nodejs di port 3000
app.listen(3000, function() {
  console.log("Server is running on Port 3000");
});
