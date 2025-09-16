import express from "express";
import { createRentListing, getAllRentListings, updateRentListingById, deleteRentListingById} from "../controllers/rentController.js";
// Comment out or remove these imports for now
// import { verifyAccessToken } from "../middleware/userAuth.js";
// import { checkAdminNumber } from "../middleware/checkAdminNumber.js";

const router = express.Router();

router.post("/create", createRentListing);
// route 1: create rent listing

router.get("/all", getAllRentListings);
// route 2: get all rent listings

router.put("/update/:id", updateRentListingById);
// route 3: update a single rent listing by ID

router.delete("/delete/:id", deleteRentListingById);
// route 4: delete a single rent listing by ID

export default router;