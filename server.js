const express=require("express")
const app=express()
const mongoose=require("mongoose")
const shortUrl=require("./models/scheme")

//set port for server to run
const port=300;

//setup view-engine
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:false}))

//connect to db
mongoose.connect("mongodb://localhost:27017/URL-Shortener")

app.get("/", (req, res) =>{
    res.render("index")
})

app.post("/new-short-url", async (req,res)=>{
    const longUrl=req.body.url
    const db_object=await shortUrl.create( {longURL: longUrl })

    res.send(db_object)
})

app.get("/:shortUrl", async (req,res)=>{
    const urlData=await shortUrl.findOne({shortURL:req.params.shortUrl})
    if(!urlData){
        res.send(404)
    }else{
        res.redirect(urlData.longURL)
    }
})
app.listen(port, ()=>{
    console.log("runnning on port", port)
})