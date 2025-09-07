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


router.get("/addtocart/:productId", isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });
    const product = await productModel.findById(req.params.productId);

    if (!product) {
        req.flash("error", "Product not found!");
        return res.redirect("/shop");
    }

    user.cart = user.cart || [];
    const existingItem = user.cart.find(item => item.product && item.product.toString() === product._id.toString());

    const action = req.query.action;
    if (existingItem) {
        if (action === "increase") existingItem.quantity += 1;
        else if (action === "decrease") {
            existingItem.quantity -= 1;
            if (existingItem.quantity <= 0) {
                user.cart = user.cart.filter(i => i.product && i.product.toString() !== product._id.toString());
            }
        } else existingItem.quantity += 1;
    } else {
        user.cart.push({ product: product._id, quantity: 1 });
    }

    await user.save();

    const actionFrom = req.query.from;
    if (actionFrom === "cart") res.redirect("/cart");
    else res.redirect("/shop");
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