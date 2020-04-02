import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

const { isEmail } = validator;

const { Schema } = mongoose;
const SALT_WORK_FACTOR = 10;
export const MIN_PASSWORD_LENGTH = 5;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: [isEmail],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: MIN_PASSWORD_LENGTH,
  },
});

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject({ versionKey: false });
  delete user.password;
  return user;
};

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

export default mongoose.model('User', UserSchema);
