const mongoose = require('mongoose');

// const uri = `mongodb+srv://shivam:Qu%40dr%40fort%402023@quadrafortmgmt.dqshe2v.mongodb.net/quadrafort_mgmt_live`; //online
const uri = `mongodb+srv://shivam:Qu%40dr%40fort%402023@quadrafortmgmt.dqshe2v.mongodb.net/test`; //online

mongoose.connect(uri, {
  useNewUrlParser:true, useUnifiedTopology: true
});

const mongodb = mongoose.connection;
console.log(`Mongoose Connection Ready State : ${mongoose.connection.readyState}`);
mongodb.on("error", console.error.bind(console, "connection error: "));


mongodb.once("open", function () {
  console.log("Mongo DB Connected successfully");
});

function mongoShutDown(){
  mongodb.close(true, ()=>{
    console.log('mongodb connection closed');
  });
}

module.exports = {mongodb, mongoShutDown};