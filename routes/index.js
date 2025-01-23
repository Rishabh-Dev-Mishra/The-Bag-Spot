const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { logout } = require("../controllers/authContoller");
const router = express.Router();

const userModel = require("../models/user-model");
const productModel = require("../models/product-model");

router.get("/", (req, res) => {
    const error = req.flash("error");
    res.render("index", { error, loggedin: !!req.cookies.token });
});

router.get("/shop", isLoggedIn, async (req, res) => {
    try {
        const { filter, sortby } = req.query; 

        let filterQuery = {};
        if (filter) {
            if (filter === 'new') {
                filterQuery.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }; 
            } else if (filter === 'discounted') {
                filterQuery.discount = { $gt: 0 }; 
            } else if (filter === 'all') {
                filterQuery = {};  
            }
        }

        // Sorting logic
        let sortQuery = {};
        if (sortby) {
            if (sortby === "newest") {
                sortQuery = { createdAt: -1 };  
            } else if (sortby === "popular") {
                sortQuery = { popularity: -1 }; 
            }
        }

        const products = await productModel.find(filterQuery).sort(sortQuery);

        const success = req.flash("success");
        res.render("shop", { products, success });
    } catch (error) {
        console.error("Error fetching products:", error);
        req.flash("error", "Could not fetch products, please try again!");
        res.redirect("/");
    }
});


router.get("/cart", isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email }).populate("cart");

        const groupedProducts = user.cart.reduce((group, product) => {
            const foundProduct = group.find(p => p.product._id.toString() === product._id.toString());

            if (foundProduct) {
                foundProduct.quantity += 1;
            } else {
                group.push({ product, quantity: 1 });  
            }

            return group;
        }, []);

        const bill = groupedProducts.reduce((sum, { product, quantity }) => {
            return sum + (product.price - product.discount) * quantity;
        }, 0) + 20; 

        res.render("cart", { user, groupedProducts, bill });
    } catch (error) {
        console.error("Error fetching cart:", error);
        req.flash("error", "Could not fetch cart details!");
        res.redirect("/shop");
    }
});


router.get("/addtocart/:productId", isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });

        user.cart.push(req.params.productId);
        await user.save();

        req.flash("success", "Added to cart");
        res.redirect("/shop");
    } catch (error) {
        console.error("Error adding to cart:", error);
        req.flash("error", "Could not add product to cart!");
        res.redirect("/shop");
    }
});

router.get("/updatequantity/:productId/:action", isLoggedIn, async (req, res) => {
    const { productId, action } = req.params;

    try {
        const user = await userModel.findOne({ email: req.user.email });

        const productIndex = user.cart.findIndex(p => p.toString() === productId);

        if (productIndex !== -1) {
            if (action === "increase") {
                user.cart.push(productId); 
            } else if (action === "decrease") {
                if (user.cart.length > 1) {
                    user.cart.splice(productIndex, 1);
                } else {
                    user.cart.splice(productIndex, 1);
                }
            }
            await user.save(); 
        }

        res.redirect("/cart");  
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        req.flash("error", "Could not update cart!");
        res.redirect("/cart");
    }
});


// Logout route
router.get("/logout", isLoggedIn, logout);

module.exports = router;
