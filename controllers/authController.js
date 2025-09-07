const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generateToken");

module.exports.register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (user) {
            req.flash("error", "You already have an account, please login!");
            return res.status(401).redirect("/");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            fullname,
            email,
            password: hash,
        });

        req.flash("success", "User created successfully!");
        return res.status(201).redirect("/");
    } catch (error) {
        if (error.errors.email.properties.path === "email") {
            console.error("Error in auth controller:", error);
            req.flash(
                "error",
                `${error.errors.email.properties.value} is not a valid email!`
            );
            return res.status(500).redirect("/");
        }
    }
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            req.flash("error", "Email or password is incorrect!");
            return res.status(401).redirect("/");
        }

        if (req.cookies.token) {
            req.flash("error", "You are already logged in!");
            return res.status(401).redirect("/shop");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            req.flash("error", "Email or password is incorrect!");
            return res.status(401).redirect("/");
        }

        const token = generateToken(user);
        res.cookie("token", token, { httpOnly: true });

        req.flash("success", "You have logged in successfully!");
        console.log("User logged in:", email); 
        return res.status(200).redirect("/shop");
    } catch (error) {
        console.error("Login error:", error);
        req.flash("error", "Something went wrong, please try again!");
        return res.status(500).redirect("/");
    }
};

module.exports.logout = async (req, res) => {
    req.flash("success", "You have logged out successfully!");
    res.clearCookie("token");
    return res.redirect("/");
};
