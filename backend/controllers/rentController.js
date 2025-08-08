import RentFlat from "../models/rentflats.js";

// Route 1 - Create a new rent listing
export const createRentListing = async (req, res) => {
    const { contact } = req.params;
    const rentData = { ...req.body, contact };

    try {
        const newListing = await RentFlat.create(rentData);
        res.status(201).json({
            message: `New flat for rent listed by ${contact}.`,
            data: newListing
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Route 2 - Get all rent listings
export const getAllRentListings = async (req, res) => {
    try {
        const listings = await RentFlat.find();
        res.status(200).json({
            message: "All the list of flats are listed below.",
            data: listings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Route 3 - Get specific rent listings by contact
export const getRentListingsByContact = async (req, res) => {
    const { contact } = req.params;

    try {
        const listings = await RentFlat.find({ contact });
        res.status(200).json({
            message: `All flats listed by agent ${contact}.`,
            data: listings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Route 5 - Delete rent listings by contact
export const deleteRentListing = async (req, res) => {
    const { contact } = req.params;

    try {
        await RentFlat.deleteMany({ contact });
        res.status(200).json({
            message: `All listings by ${contact} have been deleted.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
            }
};