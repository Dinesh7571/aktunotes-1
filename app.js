//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static("public"));
require('dotenv').config();


/// mongo db connection 
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,// this is donebidu
})
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Failed to connect to database', err));

const aboutContent="We are the most farzi peoplesin the world"
const contactContent="this is our contact, www.farzi.com"

// mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const courseSchema = new mongoose.Schema({
  course: { type: String, required: true },
  year: { type: Number, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  link: { type: String, required: true },
  imgLink: { type: String, required: true },
});

const Course = mongoose.model('Course', courseSchema); //connecting the model with schema


// Create a new course object

// newCourse.save();

var currentSubject="Computer Science"// initialising the universal subject variable

app.get("/", function(req, res){
  res.render("index");
});
// testing area
app.get("/:branch", function(req, res){// use is to navigate for diffrent branch using post is ":postId is the parameter name"
  const requestBranch=req.params.branch;
  if(requestBranch=='upload')
  {
    res.render("upload");
  }
  else if(requestBranch=='cse'||requestBranch=='civil'||requestBranch=='mechanical'||requestBranch=='ai')
  {
     if(requestBranch=='cse')
       currentSubject="Cmputer Science"
    else if(requestBranch=='civil')
       currentSubject="Civil"
    else if(requestBranch=='ai')
       currentSubject="AI/ML"
    else if(requestBranch=='mechanical')
       currentSubject="Mechanical"
    res.render("cse", {
      title: requestBranch,
      heading:currentSubject,
    })
  }
 

})

app.get("/upload", function(req, res){
  res.render("upload");
});
app.post("/upload", function(req,res)
      { 
         var branch = String(req.body.branch);
         var type = String(req.body.type);
         var year= Number(req.body.year);
         var name = String(req.body.name);
         var link = String(req.body.link);
         var imglink = String(req.body.imglink);
         const newCourse = new Course({
          course:branch,
          year: year,
          name: name,
          type:type,
          link: link,
          imgLink:imglink,
        });
          
           console.log(newCourse);
         newCourse.save(); // saving the new persone to the database
         // to insert many new persones krishna, vivek,dinu at a single time 
         // we use persone.insertMany([krishna,vivek,dinu], funtion(err){ console.log(err)}
         res.redirect("/");
      })
// app.get("/branch", function(req, res){
//   res.render("branch",{branchTitle:"cse "});
// });
app.get("/:branch/:year", function(req, res){// use is to navigate for diffrent branch using post is ":postId is the parameter name"
    const requestBranch=req.params.branch;
    const requestYear=req.params.year;
    
    if(requestYear>4||requestYear<1)
    {
     res.render('error', { title: 'Error', message: 'Invalid Page Number' });
    }
     
    Course.find({
      course:requestBranch,
      year:requestYear,
      type:"notes",
    }).then((results) => {
      console.log(results);
     
            // Return the results
            res.render("all_notes", {
              title: requestBranch,
              year:requestYear,
              courses:results
            })
          
  
     })



    });
   
      
    //working here

app.get("/about", function(req, res){
  res.render("about", {about: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contact: contactContent});
});


const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Server started on port 3000");
});
