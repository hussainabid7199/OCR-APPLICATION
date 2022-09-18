const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");
const multer = require("multer");
const tesseract = require("tesseract.js");


const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/", (req,res)=>{
    res.render("index");
})


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload = multer({storage:storage});


app.post("/api/upload", upload.single("uploadedImage"),(req,res)=>{
    console.log(req.file);

    try{
        tesseract.recognize(
            "uploads/"+req.file.filename,
            "eng",
            {logger:m =>console.log(m)}
        ).then(({data:{text}})=>{

          return res.json(
                {
                    message:text
                }
            )
        })
    }catch(error){
        console.error(error);
    }
})





app.listen(4000, (req,res)=>{
    console.log("Server is running on port 4000 succesfully.");
})