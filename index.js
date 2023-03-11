const storage = require('node-persist');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const jsonbody = bodyparser.json();

//initialize node persist
storage.init();

// to add new students
app.post('/student', jsonbody, async (req, res) => {

    const students = await storage.getItem("students");
    const newStud = req.body;
    newStud.id = students ? students.length + 1 : 101;
    await storage.setItem("students", [...students, newStud]);
    res.send(students);
})


// to get all students
app.get("/student",async(req,res)=>{
    const students = await storage.getItem("students");
    //res.send(employees);
    
    let html=`<h1>Employee data</h1>
        <table>
            <thead>
                <tr>
                    <th>Student Id :</th>
                    <th>Student Name :</th>
                    <th>GPA :</th>
                </tr>
            </thead>
    `
    const data= students.filter(ele=>{
        html+=
        `<tbody>
            <tr>
                <td>${ele.id}</td>
                <td>${ele.name}</td>
                <td>${ele.gpa}</td>
            </tr>
        </tbody>`
    })
    html+= '</table>';
    res.send(html);
});


// to get a specific student
app.get("/student/:id",async(req,res)=>{
    const students = await storage.getItem("students");
    const id= req.params.id;
    res.send(students.filter(x=>x.id==id));
});

// to get a student based on gpa
app.get("/bestgpa",async(req,res)=>{
    const students = await storage.getItem("students");
    let bestgpa = students.filter(function(ele){
        return ele.Math.max(req.params.gpa);
    })

    res.send("<h1>Highest Grade Student<h1>");
    res.send("Student Id :",bestgpa.id);
    res.send("Student Name:",bestgpa.name);
    res.send("GPA : ", bestgpa.gpa);
    
});


app.listen(5000, () => {
    console.log("Server Is been Started Successfully...!")
});


