import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  advertiser: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertiser', required: true },
  block: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.model('Block', blockSchema);
