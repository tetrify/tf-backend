import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  route: { type: String, required: true },
  blocks: { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true });

export default mongoose.model('Page', pageSchema);
