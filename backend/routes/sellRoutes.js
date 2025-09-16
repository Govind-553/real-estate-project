import express from "express";
import { 
    createSellListing, 
    getAllSellListings, 
    updateSellListingById, 
    deleteSellListingById 
} from "../controllers/sellController.js";
// Comment out or remove these imports for now
// import { verifyAccessToken } from "../middleware/userAuth.js";
// import { checkAdminNumber } from "../middleware/checkAdminNumber.js";

const router = express.Router();

router.post("/create", createSellListing);
// route 1: create sell listing

router.get("/all", getAllSellListings);
// route 2: get all sell listings

router.put("/update/:id", updateSellListingById);
// route 3: update a single sell listing by ID

router.delete("/delete/:id", deleteSellListingById);
// route 4: delete a single sell listing by ID

export default router;