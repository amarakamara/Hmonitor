import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  username: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
});

// Add Passport-Local Mongoose plugin to handle username and password
adminSchema.plugin(passportLocalMongoose);

// Validation rules for the username and password fields
adminSchema.path("username").validate(function (value) {
  return /^[a-zA-Z0-9]+@[a-z0-9]+\.[A-Za-z]{2,15}$/.test(value);
}, "Invalid Username");

//how do I add a password validation below?

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
