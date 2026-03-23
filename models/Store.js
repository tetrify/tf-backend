import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  store_id: { type: String, required: true },
  advertiser: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertiser', required: true },
  store_url: { type: String },
  store_name: { type: String },
  store_logo: { type: String },
  pixels: [{ type: String }],
  domains: [{ type: String }],
  config: { type: mongoose.Schema.Types.ObjectId, ref: 'Config', required: true },
  checkout: { type: String }
}, { timestamps: true });

export default mongoose.model('Store', storeSchema);
