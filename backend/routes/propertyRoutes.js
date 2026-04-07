const express = require("express");
const router = express.Router();
const Property = require("../models/models/property");
const authMiddleware = require("../middleware/authMiddleware"); // 🔥 add this

// ➕ Add Property
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { title, price, location, description } = req.body;

        const property = new Property({
            title,
            price,
            location,
            description, // ✅ comma
            user: req.user.id   // 🔥 important
        });

        await property.save();

        res.json({ message: "Property added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📥 Get all properties
router.get("/", async (req, res) => {
    const properties = await Property.find();
    res.json(properties);
});
// 🗑 Delete Property
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ✏ Update Property
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, price, location, description } = req.body;

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      {
        title,
        price,
        location,
        description
      },
      { new: true }
    );

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔐 Get logged-in user properties
router.get("/my", authMiddleware, async (req, res) => {
    const properties = await Property.find({ user: req.user.id });
    res.json(properties);
});

module.exports = router;