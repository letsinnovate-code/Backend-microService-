import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    

      firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },
    

    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      url: String,
      publicId: String,
    },

    password: {
      type: String,
      minlength: 8,
      select: false,
    },

    // Authentication Provider
    provider: {
      type: String,
      enum: [
        "credentials",
        "google",
        "github",
        "facebook",
        "apple",
      ],
      default: "credentials",
    },

    providerId: String,

    // Verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: String,

    emailVerificationExpires: Date,

    // Password Reset
    passwordResetToken: String,

    passwordResetExpires: Date,

    // Refresh Token
    refreshToken: String,

    // Roles
    role: {
      type: String,
      enum: ["USER", "ADMIN", "MODERATOR"],
      default: "USER",
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    blockedAt: Date,

    blockedReason: String,

    // Security
    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: Date,

    lastLogin: Date,

    lastPasswordChangedAt: Date,

    // Two Factor Authentication
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    twoFactorSecret: String,

    // Preferences
    language: {
      type: String,
      default: "en",
    },

    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },

    // Soft Delete
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Hash Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("user", userSchema);