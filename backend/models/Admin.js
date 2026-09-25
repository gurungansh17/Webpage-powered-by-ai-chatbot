const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// D3 — Admin collection
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    maxlength: [50, "Username cannot exceed 50 characters"],
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, "Password is required"],
    maxlength: [255],
  },
  email: {
    type: String,
    required: [true, "Admin email is required"],
    maxlength: [150],
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving if modified
adminSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

// Method to compare plain password against hash
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

// Never return passwordHash in JSON responses
adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model("Admin", adminSchema);
