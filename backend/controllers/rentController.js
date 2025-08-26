import RentFlat from "../models/rentflats.js";
import User from "../models/User.js";

// Route 1 Create a new rent listing
export const createRentListing = async (req, res) => {
    
    const mobileNumber = req.mobileNumber; // Assuming phoneNumber is set by authentication middleware

    const { contact, location, price } = req.body;
    const rentData = { location, price };

    try {

        // Validate input data
        if ( !contact || !location || !price ) {
            return res.status(400).json({ message: "Missing contact or rent data." });
        }

        //check if user exists
        const user = await User.findOne({ mobileNumber: contact });
        if (!user) {
            return res.status(404).json({ message: "User with this contact not found." });
        }

        if (!location || !price) {
            return res.status(400).json({ message: "Location and price are required." });
        }

        // Create a new rent listing
        const newListing = new RentFlat({
            ...rentData,
            contact : user.mobileNumber,
            userId: user._id,
            userName: user.fullName,
        });

        // Save the new listing
        const savedListing = await newListing.save();

        // Respond with the created listing
        res.status(201).json({
            message: "New flat for rent is listed successfully.",
            listing: savedListing,
        });

    } catch (error) {
        console.error("Error creating rent listing:", error.message);
        res.status(500).json({ message: "Server error while creating rent listing." });
    }
};

// Route 2 Get all rent listings
export const getAllRentListings = async (req, res) => {

    const mobileNumber = req.mobileNumber;

    try {
        // Validate input data
        if (!mobileNumber) {
            return res.status(400).json({ message: "Mobile number is required." });
        }

        //Fetch all rent listing
        const listings = await RentFlat.find();
        res.status(200).json({
            message: "All the flats for rent are listed below.",
            count: listings.length,
            rentFlatsList: listings,
        });
    } catch (error) {
        console.error("Error fetching listings:", error.message);
        res.status(500).json({ message: "Server error while fetching listings." });
    }
};

//  Route 3 Get listings by contact
export const getRentListingsByContact = async (req, res) => {

     // Assuming mobileNumber is set by authentication middleware
    const mobileNumber = Number(req.mobileNumber);

    const contact = Number(req.body.contact);

    try {
         //if contact number is not provided.
        if (!contact) {
            return res.status(400).json({ message: "contact Number is required." });
        }

        const user = await User.findOne({ mobileNumber: contact });
        if (!user) {
            return res.status(404).json({ message: "This contact is not registered." });
        }

        const listings = await RentFlat.find({ contact });

        //if no listings found for entered number.
        if (!listings || listings.length === 0) {
            return res.status(404).json({ message: "No listings found for this contact." });
        }

        //successfully fetched listings.
        res.status(200).json({
            message: "All the flats of the specific agent are listed below.",
            rentFlatsList: listings,
        });

    } catch (error) {
        console.error("Error fetching listings by contact:", error.message);
        res.status(500).json({ message: "Server error while fetching listings." });
    }
};

// Route 4 Update listings by contact
export const updateRentListingByContact = async (req, res) => {
    
    const contact = req.mobileNumber;

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

// Route 5 Delete listings by contact
export const deleteRentListingByContact = async (req, res) => {
  const { RentFlatId, contact } = req.body;
  const mobileNumber = req.mobileNumber; // coming from middleware

  try {
    if (!RentFlatId || !contact) {
      return res.status(400).json({ message: "RentFlatId and contact are required." });
    }

    // Delete the listing only if both _id and contact match
    const result = await RentFlat.findOneAndDelete({
      _id: RentFlatId,
      contact: Number(contact),
    });

    if (result) {
      return res.status(200).json({
        message: `Deleted listing with ID ${RentFlatId} for contact ${contact}.`,
      });
    } else {
      return res.status(404).json({ message: "No listing found for the given ID and contact." });
    }
  } catch (error) {
    console.error("Error deleting listings:", error.message);
    res.status(500).json({ message: "Server error while deleting listings." });
  }
};
