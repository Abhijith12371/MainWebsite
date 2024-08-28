const mongoose = require('mongoose');
const PassportLocalMongoose = require('passport-local-mongoose');
const password=process.env.password
// Connect to MongoDB using Mongoose
mongoose.connect(`mongodb+srv://abhijithnagula:${password}@logindb.bdzgn.mongodb.net/?retryWrites=true&w=majority`)
.then(() => console.log("Connected to MongoDB using Mongoose"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

// Define a User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  }
});

// Add PassportLocalMongoose plugin
userSchema.plugin(PassportLocalMongoose);

// Create a User model
const User = mongoose.model('User', userSchema);

module.exports = User;
