const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    title: String,
    price: Number,
    location: String,
    description: String,
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}
});

module.exports = mongoose.model("Property", propertySchema);