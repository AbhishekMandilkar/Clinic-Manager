const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");

const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/clinicDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  bp: Number,
  weight: Number,
  complaints: String,
  extra: String,
  nVisit: String,
  mobno: String,
  pVisit: String,
});

const Patient = mongoose.model("Patient", patientSchema);

let patients = [];

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/showPatients", function (req, res) {
  Patient.find({}, function (err, patients) {
    res.render("list", { patients: patients });
  });
});

app.get("/add-patient", function (req, res) {
  res.render("add-patient");
});

app.post("/add-patient", function (req, res) {
  let now = moment();
  console.log(now.format("MMMM Do YYYY, h:mm:ss a"));
  const patient = new Patient({
    name: req.body.pName,
    age: req.body.pAge,
    gender: req.body.pGender,
    bp: req.body.pBP,
    weight: req.body.pWeight,
    complaints: req.body.pComplaints,
    extra: req.body.pExtra,
    nVisit: req.body.nVisitdate,
    mobno: req.body.pMob,
    pVisit: now,
  });

  patient.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Success");
      res.redirect("/add-patient");
    }
  });
});
let foundInfo;
app.get("/search", function (req, res) {
  res.render("search");
});

app.post("/search", function (req, res) {
  let toFind = req.body.query;
  console.log(toFind);
  Patient.findOne({ mobno: toFind }, function (err, foundInfo) {
    if (foundInfo) {
      console.log(foundInfo);
      res.render("search", { foundInfo: foundInfo });
    } else {
      res.render("search");
    }
  });
});

let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server up and running");
});
