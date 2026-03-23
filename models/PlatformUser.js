import mongoose from 'mongoose';

const platformUserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
  advertiser: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertiser', required: true }
}, { timestamps: true });

export default mongoose.model('PlatformUser', platformUserSchema);
