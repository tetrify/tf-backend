import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
  blocks: { type: mongoose.Schema.Types.Mixed, default: [] },
  type: { type: String, required: true },
  advertiser: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertiser', required: true }
}, { timestamps: true });

export default mongoose.model('Theme', themeSchema);
