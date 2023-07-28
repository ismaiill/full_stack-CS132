/**
 * @author Ismail Abouamal
 * June 9, 2023
 * CS 132 Spring 2022
 * app.js for the final project CS132. API documentation is available at https://documenter.getpostman.com/view/27866896/2s93saZYcR 
 */

"use strict";
const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(multer().none()); 

let tutors;
let comments;
let reviews;
const SERVER_ERR_CODE = 500;
const CLIENT_ERR_CODE = 400;
const SERVER_ERROR = "Something went wrong on the server, please try again later.";
 

async function readTutorFile(){

   fs.readFile('tutors.json', 'utf8', function (err, data) {
  if (err) {
    console.error(err);
  } else{
    tutors = JSON.parse(data);

  }
});

}

async function ReadCommentsFile(){

  fs.readFile('comments.json', 'utf8', (err, data) => {
    comments = JSON.parse(data);
    console.log('were here');
    
  });


}

/**
 * GET endpoint that returns all the list of all available tutors.
 * Returns a a JSON response of the list containing all tutors and their information.
 */
app.get("/tutors",  async (req, res) => {
  try {
    await readTutorFile();
    res.json(tutors);
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;

  }
});

/**
 * Returns a plaintext response with the full name of the staff member who
 * has the given username. Responds with 400 error if the given 
 * username is not found. 
 */
app.get("/tutors/:username", async (req, res) => {

  await readTutorFile();
  let username = req.params.username;
  if (tutors[username]) {
    res.send(tutors[username]);
  } else {
    res.status(400).send("No user found for username: " + username);
  }
});

/**
 * Filter the tutors through their specialty. 
 * Returns a JSON file with the updated list of tutors with the specicfic specialty.
 */
app.get('/TutorSpec', async (req, res) => {
  try {

    await readTutorFile();
    const specialty = req.query.specialty;
    const filteredTutors = {};

    for (let tutor in tutors) {
      if (tutors[tutor].specialty === specialty) {
        filteredTutors[tutor] = tutors[tutor];
      }
    }
    if (Object.keys(filteredTutors).length === 0) {
      res.status(CLIENT_ERR_CODE).send('This category does not exsit. Please choose another category.');
    } else {
      res.json(filteredTutors);
    }
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
  }
});

/**
 * Posts a new comment on the server and updates the file comment.json
 */
app.post('/contact', async (req, res) => {
    let newCommt = processCommentMsg(req.body.name, req.body.email, req.body.comment);  


  try{

    let data = await fs.promises.readFile('comments.json', 'utf8');
    comments = JSON.parse(data);
    comments.push(newCommt);
    await fs.promises.writeFile("comments.json", JSON.stringify(comments, null, 2), "utf8");

    console.log('A user has submitted the following form:', newCommt);
    console.log('comments:', comments);   

  res.send('Thank you for your comment! We received your feedback and we will get back to you shortly!');

  } catch(err){
    res.status(SERVER_ERR_CODE);
    err.message = SERVER_ERROR;
  }

});

/**
 * Posts a new review on the server and updates the file tutors.json
 */
app.post('/review', async (req, res) => {
  let newCommt = processReviewtMsg(req.body.name, req.body.rating, req.body.review); 

try{
  const tutorNickName =  req.body.tutorNickName;
  let data = await fs.promises.readFile('tutors.json', 'utf8');
  tutors = JSON.parse(data);
  tutors[tutorNickName].reviews.push(newCommt);
  console.log(tutorNickName);
  await fs.promises.writeFile("tutors.json", JSON.stringify(tutors, null, 2), "utf8");
  res.send(`Thanks you! your review has been received.`);

} catch(err){
  res.status(SERVER_ERR_CODE);
  err.message = SERVER_ERROR;
}

});

/** 
 * Processes the data from the contact from and returns a string containing the relevant information.
 * 
 * @param {string} name -  name
 * @param {string} email - email  
 * @param {string} comment - content of the comment.
 * @returns string containing the name, email and the comment. 
 */
function processCommentMsg(name, email, comment) {
  let result = null;
  if (name && email && comment) {
    result = {
      "name" : name,
      "email" : email,
      "comment" : comment,
      "timestamp" : new Date().toUTCString()
    };
  }
  return result;
}


/** 
 * Processes the data from the review from and returns a string containing the relevant information.
 * 
 * @param {string} name -  name
 * @param {string} rating - rating  
 * @param {string} review - content of the review.
 * @returns string containing the name, rating and the review. 
 */
function processReviewtMsg(name, rating, review) {
  let result = null;
  if (name && rating && review) {
    result = {
      "name" : name,
      "rating" : rating,
      "review" : review,
      "timestamp" : new Date().toUTCString()
    };
  }
  return result;
}

app.use(express.static("public"));
app.use('/imgs', express.static("imgs"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});