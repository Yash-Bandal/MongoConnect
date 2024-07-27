const express =require("express");
//const { default: mongoose } = require("mongoose");
const app=express();
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const path = require("path");

// Serve static files from the "images" directory
app.use('/images', express.static(path.join(__dirname, 'images')));


//configuration
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://Yash_L:yash0731@cluster0.z0ukjkn.mongodb.net/notesDB", { useNewUrlParser: true, useUnifiedTopology: true });

//create a data schema
const notesSchema={
    title:String,
    Subject:String,
    UserName:String,
    RBT:String,
    division:String,
    mail:String,
    content:String
}

const Note=mongoose.model("Note",notesSchema);


// //
// app.get("/",function(req,res){
//     res.sendFile(__dirname + "/retreve.html");
// })
//
app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})


app.post("/",function(req,res){
    let newNote=new Note({
        Subject:req.body.Subject,
        UserName:req.body.UserName,
        RBT:req.body.RBT,
        division:req.body.division,
        mail:req.body.mail,
        content:req.body.content
    })
    newNote.save();
    res.redirect("/");  //avoids reloading
})






// Update route
app.post("/update", async function(req, res) {
    const email = req.body.email; // Assuming email is a unique field
    const updatedData = {
        Subject: req.body.Subject,
        UserName: req.body.UserName,
        RBT: req.body.RBT,
        division: req.body.division,
        mail: req.body.mail,
        content: req.body.content
    };

    try {
        // Step 1: Retrieve Data
        const existingNote = await Note.findOne({ mail: email });

        if (!existingNote) {
            console.log("Note not found for the given email:", email);
            return res.redirect("/");  }
        // Step 2: Update Data
        // Modify the existing note with the updated data
        existingNote.Subject = updatedData.Subject;
        existingNote.UserName = updatedData.UserName;
        existingNote.RBT = updatedData.RBT;
        existingNote.division = updatedData.division;
        existingNote.mail = updatedData.mail;
        existingNote.content = updatedData.content;

        // Step 3: Save Changes
        const updatedNote = await existingNote.save();
        console.log("Note updated successfully:", updatedNote);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.redirect("/");    }
});
// Delete route
app.post("/delete", async function(req, res) {
    const email = req.body.email; // Assuming email is a unique identifier
    try {
        // Step 1: Delete Data
        const deleteResult = await Note.findOneAndDelete({ mail: email });
        if (!deleteResult) {
            console.log("No notes found for the given email:", email);
        } else {
            console.log("Note deleted successfully:", deleteResult);
        }
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});




// Route to display retrieved data based on email
app.post("/retrieve", async function (req, res) {
    const email = req.body.email; // Get email from request body

    try {
        // Retrieve data based on email
        const foundNotes = await Note.find({ mail: email });

        if (foundNotes.length === 0) {
            // No notes found for the given email
            res.send("No notes found for the given email.");
        } else {
            // Notes found, send them as response
            res.send(foundNotes);
        }
    } catch (err) {
        // Error handling
        console.log(err);
        res.send("Error occurred while retrieving notes.");
    }
});

//app.post
app.listen(3000, function () {
    console.log("Server is Running on 3000 ");
})
