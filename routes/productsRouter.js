const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async function (req, res) {
    try {
        const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        const product = await productModel.create({
            image: `/images/${req.file.filename}`, 
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        });

        req.flash("success", "Product created successfully");
        res.redirect("/owners/admin");
    } catch (err) {
        console.error(err);
        res.send("Something went wrong");
    }
});

module.exports = router;

