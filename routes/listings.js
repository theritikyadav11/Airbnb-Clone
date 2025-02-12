const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//listings Routes----

router.route("/")
.get(wrapAsync(listingController.index))
.post(upload.single('listing[image]'),validateListing,wrapAsync(listingController.addListing));


//add route
router.get("/new",isLoggedIn,listingController.renderAddForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

//update route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderUpdateForm));

module.exports=router;
