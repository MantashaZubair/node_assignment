const express = require("express");
const app = express();

const storage = require("node-persist");
app.use(express.json());


const init = async () => {
  await storage.init({ dir: "./students" });
};
init();

//.......some link are use fo r easy to track.........

app.get("/", (req, res) => {
  html = `<h1 style='color:#043b5c;font-size:2.6rem;text-shadow: 2px 2px 8px #FF0000;
    text-transform: capitalize;'>welcome to home page </h1>
    <p style='color:#043b5c;font-size:1.5rem;text-shadow: 2px 2px 8px #a3a0a9' ;
    text-decoration: none;>Link is:
    <a href = "http://localhost:8080/allStudents">AllStudent</a>&nbsp&nbsp
    <a href = "http://localhost:8080/student/1">StudentId</a>&nbsp&nbsp
    <a href = "http://localhost:8080/topper">Topper</a>&nbsp&nbsp
    <a href = "http://localhost:8080/rank">Rank All Student</a>&nbsp&nbsp
   <p> `;

  res.send(html);
});

//.......all Student...........

app.get("/allStudents", async (req, res) => {
  const students = await storage.getItem("students");
  let html =
    "<h1  style='color:#043b5c;font-size:2.6rem;text-shadow: 2px 2px 8px #FF0000'>All Students Data</h1>";
  students.forEach((student) => {
    html += `
 <div style="font-size:25px;font-weight:500;color: #16453e;text-transform: capitalize;"> 
<h3>Student id: ${student.id}</h1> 
<h3>Student name: ${student.name}</h1>
 <h3>Student gpa: ${student.GPA}</h1>
 <hr> 
</div> 
`;
  });
  res.send(html);
});


//.........get student with id.......

app.get("/student/:id", async (req, res) => {
  const students = await storage.getItem("students");
  let html =
    "<h1 style='color:#043b5c;font-size:2.6rem;text-shadow: 2px 2px 8px #FF0000'> Student Data: </h1>";
  const studentId = students.findIndex((student) => {
    return req.params.id == student.id;
  });
 // console.log(req.params.id-students.length)
  console.log(studentId + 1);
  if (studentId >= 0) {
    let stu = students[studentId];
    html += `
<div style="font-size:25px;font-weight:500;color: #16453e;text-transform: capitalize;"> 
<h3>Student id: ${stu.id}</h1> 
<h3>Student name: ${stu.name}</h1>
<h3>Student gpa: ${stu.GPA}</h1>
 
</div> 
<a style="text-decoration: none; font-size:20px; font-weight:600" href = "http://localhost:8080">go to homepage</a>&nbsp&nbsp
`;
   console.log(stu);
    res.send(html);
  }else{
    res.send(`${html}<h1 style="color:#cf000f">Opps!  404 Error </h1>
  <h2 style="color:#c0392b;text-transform: capitalize;">Id=${req.params.id} Is not in our Database
   <span style=" font-size:25px;color:#1e824c;text-transform: capitalize;"> 
   only 1-${students.length} students are available </span></h2>`);
  }
});




//......topper.....
app.get("/topper", async (req, res) => {
  const students = await storage.getItem("students");
  let html =
    "<h1  style='color:#043b5c;font-size:2.6rem;text-shadow: 2px 2px 8px #FF0000'> Student details:</h1>";

  const topper = students.sort((a, b) => b.GPA - a.GPA);
  //console.log(topper);
  html += `
    <div style="font-size:25px;font-weight:500;color: #16453e;text-transform: capitalize;"> 
   <h3>Student id: ${topper[0].id}</h1> 
   <h3>Student name: ${topper[0].name}</h1>
    <h3>Student gpa: ${topper[0].GPA}</h1>
   
   </div> 
   <a style="text-decoration: none; font-size:20px; font-weight:600" href = "http://localhost:8080">go to homepage</a>&nbsp&nbsp
   `;
  res.send(html);
});

//........Rank top to bottom...........
app.get("/rank", async (req, res) => {
  const students = await storage.getItem("students");
  let html =
    "<h1  style='color:#043b5c;font-size:2.6rem;text-shadow: 2px 2px 8px #FF0000'> Student details:</h1>";

  const topper = students.sort((a, b) => b.GPA - a.GPA);
   topper.forEach((student) => {
    html += `
        <div style="font-size:25px;font-weight:500;color: #16453e;text-transform: capitalize;"> 
       <h3>Student id: ${student.id}</h1> 
       <h3>Student name: ${student.name}</h1>
        <h3>Student gpa: ${student.GPA}</h1>
        <hr> 
       </div> 
       `;
  });
  res.send(html);
});

app.post("/createStudent", async (req, res) => {
  const students = (await storage.getItem("students")) || [];
  const newStudent = req.body;
  newStudent.id = students.length + 1;
  await storage.setItem("students", [...students, newStudent]);
  res.send("Updated");
});


app.listen(8080, () => console.log("Project running on port", 8080));
