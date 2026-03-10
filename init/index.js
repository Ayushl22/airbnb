const mongoose = require("mongoose");
const data = require("./data");
const Listing= require("../models/listing");

main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

const initDB = async () => {
    await Listing.deleteMany({});
    const listingsWithOwner = data.data.map((obj) => ({
        ...obj,
        owner: "69822b1088010a0e761a86a1"
    }));
    await Listing.insertMany(listingsWithOwner);
};
initDB();