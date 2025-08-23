import express from "express";
import { createRentListing, getAllRentListings, getRentListingsByContact, updateRentListingByContact, deleteRentListingByContact} from "../controllers/rentController.js";
import { verifyAccessToken } from "../middleware/userAuth.js";
import { checkAdminNumber } from "../middleware/checkAdminNumber.js";

const router = express.Router();

router.post("/create/:contact", verifyAccessToken, checkAdminNumber, createRentListing);
//route 1 create rent listing

router.get("/all", verifyAccessToken, checkAdminNumber, getAllRentListings);
//route 2 get all rent listing

router.get("/by-contact/:contact", verifyAccessToken, checkAdminNumber, getRentListingsByContact);
//route 3 get rent listing by contact

router.put("/update/:contact", verifyAccessToken, checkAdminNumber, updateRentListingByContact);
//route 4 update by contact

router.delete("/delete/:contact", verifyAccessToken, checkAdminNumber, deleteRentListingByContact);
//route 5 delete by contact

export default router;