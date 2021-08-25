const mongoose=require("mongoose")
const shortId=require("shortid")

const ShortUrlSchema= new mongoose.Schema({
    longURL:{
        type: String,
        required: true
    },
    shortURL:{
        type: String,
        required: true,
        unique: true,
        default: shortId.generate
    },
    count:{
        type: Number,
        required: true,
        default: 0
    }
})

module.exports=mongoose.model("shorUrl",ShortUrlSchema)