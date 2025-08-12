import express from "express";
import {
    createRentListing,
    getAllRentListings,
    getRentListingsByContact,
    updateRentListingByContact,
    deleteRentListingByContact
} from "../controllers/rentController.js";

const router = express.Router();

router.post("/create/:contact", createRentListing);
//route 1 create rent listing

router.get("/all", getAllRentListings);
//route 2 get all rent listing

router.get("/by-contact/:contact", getRentListingsByContact);
//route 3 get rent listing by contact

router.put("/update/:contact", updateRentListingByContact);
//route 4 update by contact 

router.delete("/delete/:contact", deleteRentListingByContact);
//route 5 delete by contact

export default router;