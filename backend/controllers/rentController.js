import RentFlat from "../models/rentflats.js";
import User from "../models/User.js";

//  Create a new rent listing
export const createRentListing = async (req, res) => {
    const { contact } = req.params;
    let rentData = req.body;
    rentData = { ...rentData, createdAt: new Date() };

    try {
        if (!contact || !rentData) {
            return res.status(400).json({ message: "Missing contact or rent data." });
        }

        const user = await User.findOne({ mobileNumber: contact });
        if (!user) {
            return res.status(404).json({ message: "User with this contact not found." });
        }

        const { location, price } = rentData;
        if (!location || !price) {
            return res.status(400).json({ message: "Location and price are required." });
        }

        const newListing = new RentFlat({
            ...rentData,
            contact,
            userId: user._id,
            userName: user.fullName,
        });

        const savedListing = await newListing.save();

        res.status(201).json({
            message: "New flat for rent is listed successfully.",
            listing: savedListing,
        });

    } catch (error) {
        console.error("Error creating rent listing:", error.message);
        res.status(500).json({ message: "Server error while creating rent listing." });
    }
};

//  Get all rent listings
export const getAllRentListings = async (req, res) => {
    try {
        const listings = await RentFlat.find();
        res.status(200).json({
            message: "All the flats are listed below.",
            listings
        });
    } catch (error) {
        console.error("Error fetching listings:", error.message);
        res.status(500).json({ message: "Server error while fetching listings." });
    }
};

//  Get listings by contact
export const getRentListingsByContact = async (req, res) => {
    const { contact } = req.params;
    try {
        const listings = await RentFlat.find({ contact });
        res.status(200).json({
            message: "All the flats of the specific agent are listed below.",
            listings
        });
    } catch (error) {
        console.error("Error fetching listings by contact:", error.message);
        res.status(500).json({ message: "Server error while fetching listings." });
    }
};

// Update listings by contact
export const updateRentListingByContact = async (req, res) => {
    const { contact } = req.params;
    const { location, price } = req.body;

    try {
        if (!contact) {
            return res.status(400).json({ message: "Contact is required." });
        }

        const update = {};
        if (location) update.location = location;
        if (price) update.price = price;

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ message: "No fields provided to update." });
        }

        const result = await RentFlat.updateMany({ contact }, { $set: update });

        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: `Listings updated successfully for contact ${contact}.`,
                updatedFields: update,
                modifiedCount: result.modifiedCount
            });
        } else {
            res.status(404).json({ message: "No listings found for the given contact." });
        }
    } catch (error) {
        console.error("Error updating listings:", error.message);
        res.status(500).json({ message: "Server error while updating listings." });
    }
};

// Delete listings by contact
export const deleteRentListingByContact = async (req, res) => {
    const { contact } = req.params;

    try {
        if (!contact) {
            return res.status(400).json({ message: "Contact is required." });
        }

        const result = await RentFlat.deleteMany({ contact });

        if (result.deletedCount > 0) {
            res.status(200).json({
                message: `Deleted ${result.deletedCount} listing(s) for contact ${contact}.`
            });
        } else {
            res.status(404).json({ message: "No listings found for the given contact." });
        }
    } catch (error) {
        console.error("Error deleting listings:", error.message);
        res.status(500).json({ message: "Server error while deleting listings." });
    }
};