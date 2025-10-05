// backend/models/User.js (ESM)
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar:   { type: String, default: '' },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Hash password only when modified (prevents double-hashing)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare a candidate password
userSchema.methods.comparePassword = function (candidate) {
  // this.password is available only when selected via .select('+password')
  return bcrypt.compare(candidate, this.password);
};

// In dev/hot-reload, reuse existing model to avoid OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
