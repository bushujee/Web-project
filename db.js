const mongoose=require("mongoose")
const mongourl='mongodb://127.0.0.1:27017/mywebprojectdb'

mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db=mongoose.connection


db.on('connected', ()=>{
    console.log("coonected to mongodb server");
});

db.on('error', (err)=>{
    console.log("coonected to mongodb server");
});

db.on('disconnected', ()=>{
    console.log("discoonected to mongodb server");
});

// export

module.exports=db;