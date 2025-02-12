const Listing = require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");

//index route
module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("Listings/index.ejs",{allListings});
};

//add route
module.exports.renderAddForm = (req,res)=>{ 
    res.render("Listings/add.ejs");
};

module.exports.addListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New listing created successfully");
    res.redirect("/listings");
};

//update route
module.exports.renderUpdateForm = async (req,res)=>{ 
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","The listing you requested for doesn't exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./Listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing} );
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

//show route
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error","The listing you requested for doesn't exist");
        res.redirect("/listings");
    }
    res.render("Listings/show.ejs",{listing});
};

//destroy route
module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
};


