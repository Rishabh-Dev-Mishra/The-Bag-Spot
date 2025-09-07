const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    image: String, // name of image file like "1bag.png"
    name: String,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String
});

module.exports = mongoose.model("product", productSchema);
