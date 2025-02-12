const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
    //username or password by default mongoose-passport plugin se aa jayega
});

userSchema.plugin(PassportLocalMongoose);
module.exports = mongoose.model("User",userSchema);