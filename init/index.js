const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
// const dbURL = process.env.ATLAS_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((el)=>({...el,owner:"67ab96302d1b64ee43e6139a"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();