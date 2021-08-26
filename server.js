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
mongoose.connect("mongodb://localhost:27017/URL-Shortener", ()=>{console.log("connected to db")})

app.get("/", async (req, res) =>{
    const urlData=await shortUrl.find()
    res.render("index", {urlData:urlData})
})

app.post("/new-short-url", async (req,res)=>{
    const longUrl=req.body.url
    const db_object=await shortUrl.create( {longURL: longUrl })

    res.redirect("/")
})

app.get("/user-info/:shortUrl", async (req,res) => {
    const urlData=await shortUrl.findOne({shortURL:req.params.shortUrl})
    if(!urlData){
        console.log("invalid short url")
        res.sendStatus(404)
    }else{
        res.render("info", {urlData:urlData })
    }
})

app.get("/:shortUrl", async (req,res)=>{
    const urlData=await shortUrl.findOne({shortURL:req.params.shortUrl})
    if(!urlData){
        console.log("invalid short url")
        res.sendStatus(404)
    }else if(!req.query.region){
        const url=urlData.shortURL;
        console.log("no query parameter")
        res.render("redirect",{url:url})
    }else{
        console.log("got region data")
        urlData.count++

        let regions=urlData.regions

        try{
            var region=regions.find( function (element) { return element.name==req.query.region})
        }catch (err){
            console.log(err.message)
        }
        if(region){
            regions.find( function (element) { return element.name==req.query.region}).count++
        }else{
            const newRegion={ "name":req.query.region, "count": 1 }
            regions.push(newRegion)
        }

        urlData.regions=[]
        urlData.regions.push(...regions)
        

        console.log(regions)
        urlData.save()

        console.log("saved region data")
        console.log("redirecting to original url")

        res.redirect(urlData.longURL)
    }

})


app.listen(port, ()=>{
    console.log("runnning on port", port)
})