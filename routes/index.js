var express = require("express");
var router = express.Router();
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.js");
const flash = require("connect-flash");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(
  session({
    secret: process.env.SESSION_SECRET || "abhijith",
    resave: false,
    saveUninitialized: true,
  })
);

router.use(flash());

router.use(passport.initialize());
router.use(passport.session());

router.use((req, res, next) => {
  res.locals.message = req.flash("success");
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get("/", (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  res.render("index", { pass: isAuthenticated });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  (req, res) => {
    req.flash("success", "You have successfully logged in!");
    res.redirect("/");
	
  }

);

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/logout", (req, res) => {
	req.logout((err) => {
	  if (err) {
		console.error("Logout error:", err);
		req.flash("error", "Failed to log out. Please try again.");
		return res.redirect("/");
	  }
	  req.flash("success", "You have successfully logged out!");
	  res.redirect("/");
	});
  });
  

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  let user = new User({
    email: email,
    username: username,
  });

  try {
    const registeredUser = await User.register(user, password);
    req.flash("success", "Registration successful!");
    res.redirect("/");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "Registration failed.");
    res.redirect("/register");
  }
});

const transporter = nodemailer.createTransport({
	service: 'gmail',
	port:465,
	secure:true,
	logger:true,
	debuger:true,
	secureConnection:false,
	auth: {
	  user: process.env.EMAIL_USER,
	  pass: process.env.EMAIL_PASS
	},
	tls:{
		rejectUnauthorized:true
	}
  });
  
router.post('/send-email', (req, res) => {
	console.log('Received email data:', req.body); 
  
	const { name, email, message } = req.body;
  
	const mailOptions = {
	  from: process.env.EMAIL_USER,
	  to: 'abhijithtemp71@gmail.com',
	  subject: `Message from ${name}`,
	  text: `From: ${email}\nMessage: ${message}`
	};
	if (req.isAuthenticated()) {
		// If authenticated, set the isAuthenticated flag
		var isAuthenticated = req.isAuthenticated();
		
		transporter.sendMail(mailOptions, (error, info) => {
		  if (error) {
			console.error('Error sending email:', error);
			req.flash("error", "Error sending email.");
			return res.status(500).render('index', { pass: isAuthenticated, message: req.flash("error") });
		  }
		  console.log('Email sent:', info.response); // Debug sent email info
		  req.flash("success", "Message sent successfully!");
		  res.render("index", { pass: isAuthenticated, message: req.flash("success") });
		});
	  } else {
		req.flash("error", "Please login to send email.");
		res.render("index", { pass: false, message: req.flash("error") });
	  }
	  
  });
  
module.exports = router;