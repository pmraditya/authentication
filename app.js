//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB",{ useUnifiedTopology: true,useNewUrlParser: true });

const userSchema =new mongoose.Schema({
  user:String,
  password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const userName = req.body.username;
  const password = req.body.password;
  const newuser = new User({
    user:userName,
    password:password
  });
  User.findOne({user:userName},function(err,foundItems){
    if(!err){
      if(!foundItems){
        newuser.save(function(err){
          if(err){
            res.send(err);
          }
          else{
            res.render("secrets");
          }
        });
      }
      else{
        res.send("This Email-id has already been registered");
      }
    }
    else{
      res.send(err);
    }
  });
});

app.post("/login",function(req,res){
  const userName = req.body.username;
  const password = req.body.password;
  User.findOne({user:userName},function(err,foundItems){
    if(err){
      res.send(err);
    }
    else{
      if(foundItems){
        if(password === foundItems.password){
          res.render("secrets");
        }
      }
    }
  })
});













app.listen(3000,function(){
  console.log("server has started on port 3000");
});
