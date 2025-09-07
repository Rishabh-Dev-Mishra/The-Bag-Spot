const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { logout } = require("../controllers/authController")
const router = express.Router();

const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedIn, async (req, res) => {
    const products = await productModel.find();
    const success = req.flash("success");
    res.render("shop", { products, success });
});

// Add to cart
router.get("/addtocart/:productId", isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });
    const product = await productModel.findById(req.params.productId);

    if (!product) {
        req.flash("error", "Product not found!");
        return res.redirect("/shop");
    }

    // Ensure cart is an array
    user.cart = user.cart || [];

    // Check if product already in cart
    const existingItem = user.cart.find(item => item.product && item.product.toString() === product._id.toString());

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cart.push({ product: product._id, quantity: 1 });
    }

    await user.save();
    req.flash("success", `${product.name} added to cart`);
    res.redirect("/shop");
});


// Cart page
router.get("/cart", isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email }).populate("cart.product");

    let bill = 0;

    user.cart.forEach(item => {
        if (item.product) { // make sure product exists
            bill += (item.product.price - (item.product.discount || 0)) * item.quantity;
        }
    });

    res.render("cart", { user, bill });
});



router.get("/logout", isLoggedIn, logout);

module.exports = router