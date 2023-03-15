const storage = require('node-persist');
const express = require('express');
const app = express();
app.use(express.json());

//initialize node persist
storage.init();

// to add new students
app.post('/student', async(req, res) => {

    const students = await storage.getItem("students")||[];
    const newStud = req.body;
    newStud.id = students ? students.length + 101 : 101;
    await storage.setItem("students", [...students, newStud]);
    res.send(students);
})


// to get all students
app.get("/student",async(req,res)=>{
    const students = await storage.getItem("students");


    let html=`<h1> All Students Data !</h1>
        <table>
            <thead>
                <tr>
                    <th><b>Student Id :<b>&nbsp</th>
                    <th><b>Student Name :<b>&nbsp</th>
                    <th><b>GPA :<b>&nbsp</th>
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

    const id = req.params.id; 
    res.send(students.filter(x=>x.id==id));
    
});

// to get a student based on gpa
app.get("/bestgpa",async(req,res)=>{
    const students = await storage.getItem("students");
    let bestgpa = students[0];
    for(let i = 0; i < students.length ; i++){
        if( bestgpa.gpa < students[i].gpa ){
            bestgpa = students[i];
        }
    }
    res.send( "<h1> Student Details <h1>" + "<br>" + "<b>Student Id:<b>" + bestgpa.id + "<br>" +  "<b>Student Name :<b>" + bestgpa.name + "<br>" + "<b>GPA: <b>" + bestgpa.gpa );

});


app.listen(5000, () => {
    console.log("Server Is been Started Successfully...!")
});


