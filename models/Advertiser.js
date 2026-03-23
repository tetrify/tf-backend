import mongoose from 'mongoose';

const advertiserSchema = new mongoose.Schema({
  billing: { type: Object, default: {} },
  name: { type: String },
  shopify_store_url: { type: String },
  
}, { timestamps: true });

export default mongoose.model('Advertiser', advertiserSchema);
