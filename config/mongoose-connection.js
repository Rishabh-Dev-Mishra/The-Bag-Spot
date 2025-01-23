const mongoose = require("mongoose")
const config = require("config")
const debgr = require("debug")("development:mongoose")

mongoose.
connect(`${config.get("MONGODB_URI")}/scatch`)
.then(function(){
    debgr("Connected")
})
.catch(function(err){
    console.log(err);
})

module.exports = mongoose.connection;