import mongoose,{ Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { type } from "os";

const userSchema = new Schema(
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
   address: {
    id:{
      type:String
    },
  street: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    default: "India",
    trim: true,
  },
  postalCode: {
    type: String,
    trim: true,
  },
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
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare Password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};


userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  const tokenExpiry = Date.now() + 20 * 60 * 1000;

  return { unHashedToken, hashedToken, tokenExpiry };
};


export const User = mongoose.model("user", userSchema);