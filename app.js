if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { stat } = require("fs");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const users = require("./routes/users.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
const dbURL = process.env.ATLAS_URL;

//middlewares----
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//Database connections----
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbURL);
};

// session middlewares---
const store = MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:"mysupersecretstring",
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>{
    console.log("Error in mongo session store",err);
});

const sessionOptions = {
    store,
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

//authentication middlewares--
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/registerUser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"Student@gmail.com",
//         username:"delta_student",
//     });
//     let newUser = await User.register(fakeUser,"fakePassword");
//     res.send(newUser);
// });

//routes middleware--
app.use("/listings",listings);
app.use("/listings/:id/review",reviews);
app.use("/",users);


//Error handling middleware

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong!"}=err;
    res.render("error.ejs",{message});
});
    

app.listen(3000,()=>{
    console.log("Server is listening at port 3000");
});