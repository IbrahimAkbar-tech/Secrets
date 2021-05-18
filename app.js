//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const port = 3000;

const app = express();

mongoose.connect("mongodb://localhost:27017/secretsDB", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/register", function(req, res){
  const name = req.body.username;
  const password = req.body.password;

  const newUser = new User ({
    email: name,
    password: password
  });

  newUser.save(function(err){
    if (err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err){
      console.log(err);
    } else {
      if (foundUser){
        if (foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
