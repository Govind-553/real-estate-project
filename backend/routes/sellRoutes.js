import express from "express";
import {
    createSellListing,
    getAllSellListings,
    getSellListingsByContact,
    deleteSellListing
} from "../controllers/sellController.js";

const router = express.Router();

router.post("/create/:contact", createSellListing);
router.get("/all", getAllSellListings);
router.get("/by-contact/:contact", getSellListingsByContact);
router.delete("/delete/:contact", deleteSellListing);

export default router;