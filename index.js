const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require('uuid');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const { count } = require("console");

const  methodOverride = require("method-override");


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

let port = 8080;


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: '@#abhishek',
});

app.get("/",(req,res)=>{
  let q = 'SELECT count(*) FROM user';

  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let count = result[0]["count(*)"];
     res.render("home.ejs",{count});
    

    });
       }catch(err){
        res.send(err);
      }
      
      connection.end();
  
});

//show route
app.get("/user",(req,res)=>{

  let q = 'SELECT * FROM user';

  try{
  connection.query(q,(err,result)=>{
    if(err) throw err;
    let data = result;
    res.render("user.ejs",{data});
   

  });
     }catch(err){
      res.send(err);
    }
    
  
});

//add
app.get("/user/new",(req,res)=>{
  res.render("new.ejs");
});

app.post("/user/new",(req,res)=>{

let { username,email,password } = req.body;
let  id = uuidv4();

let insrt = `INSERT INTO user  (id,username,email,password) VALUES ('${id}', '${username}', '${email}','${password}')`;

try{

  connection.query(insrt,(err,result)=>{
    if(err) throw err;
      res.redirect("/user");

  });

    }catch(err){
      res.send(err);
    }
});
//
app.get("/user", (req, res) => {
  res.send("Users list or confirmation page");
});

//update
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user  WHERE id = '${id}'  `;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;

      let user = result[0];
     res.render("edit.ejs",{ user });
     
    });
       }catch(err){
        res.send(err);
      } 
});

app.patch("/user/:id",(req,res)=>{

  let {id} = req.params;
  let {username: newUser , password : newPassword} = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}' `;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0];
      
      if(user.password != newPassword){
        res.send("WROMG PASSWORD");
      }else{
      let  q1 = `UPDATE user SET username = '${newUser}' WHERE password = '${newPassword}' `;

        connection.query(q1,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        });
      }
    

    });
       }catch(err){
        res.send(err);
       }
});

//delete

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some error with DB");
  }
});


app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});


app.listen(port,()=>{
 console.log("listening on port 8080");
});