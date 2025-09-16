import SellFlat from "../models/sellflats.js";

// Helper function to sanitize and parse the price string
const parsePrice = (priceString) => {
    // Remove all non-numeric characters except the decimal point
    const numericString = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(numericString);
};

// New helper function to clean the mobile number
const cleanMobileNumber = (mobileString) => {
    // This will remove any non-digit characters from the string
    return mobileString.replace(/\D/g, '');
};

// Route 1: Create a new sell listing
export const createSellListing = async (req, res) => {
    const { contact, location, propertyType, price, date, ownershipType, name } = req.body || {};

    try {
        if (!contact || !location || !propertyType || !price || !date || !ownershipType || !name) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }
        
        const sanitizedContact = cleanMobileNumber(contact);

        const newListing = new SellFlat({
            location,
            propertyType,
            price: parsePrice(price),
            date,
            ownershipType,
            contact: sanitizedContact,
            userName: name, // Use the name from the form
        });

        const savedListing = await newListing.save();

        res.status(201).json({
            message: "New flat for sale is listed successfully.",
            listing: savedListing,
        });
    } catch (error) {
        console.error("Error creating sell listing:", error.message);
        res.status(500).json({ message: "Server error while creating sell listing." });
    }
};

// Route 2: Get all sell listings
export const getAllSellListings = async (req, res) => {
    try {
        const listings = await SellFlat.find().lean();

        const formattedListings = listings.map(listing => ({
            ...listing,
            id: listing._id.toString(), // Add id for frontend logic
            price: `₹${new Intl.NumberFormat('en-IN').format(listing.price)}`
        }));

        res.status(200).json({
            message: "All the flats for sale are listed below.",
            count: formattedListings.length,
            sellFlatsList: formattedListings,
        });
    } catch (error) {
        console.error("Error fetching sell listings:", error.message);
        res.status(500).json({ message: "Server error while fetching listings." });
    }
};

// Route 3: Update a sell listing by its ID
export const updateSellListingById = async (req, res) => {
    const { id } = req.params; 
    const { location, propertyType, price, name, contact, date, ownershipType } = req.body || {};

    try {
        const update = {
            location,
            propertyType,
            price: parsePrice(price),
            userName: name,
            contact: cleanMobileNumber(contact),
            date,
            ownershipType
        };

        const result = await SellFlat.findByIdAndUpdate(id, { $set: update }, { new: true });

        if (result) {
            res.status(200).json({
                message: `Sell listing with ID ${id} updated successfully.`,
                updatedListing: result,
            });
        } else {
            res.status(404).json({ message: "No sell listing found for the given ID." });
        }
    } catch (error) {
        console.error("Error updating sell listing:", error.message);
        res.status(500).json({ message: "Server error while updating listing." });
    }
};

// Route 4: Delete a sell listing by its ID
export const deleteSellListingById = async (req, res) => {
    const { id } = req.params; // Get ID from URL parameter

    try {
        const result = await SellFlat.findByIdAndDelete(id);

        if (result) {
            return res.status(200).json({
                message: `Deleted listing with ID ${id}.`,
            });
        } else {
            return res.status(404).json({ message: "No listing found for the given ID." });
        }
    } catch (error) {
        console.error("Error deleting listings:", error.message);
        res.status(500).json({ message: "Server error while deleting listings." });
    }
};