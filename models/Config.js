import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  colors:{
    primary: { type: String },
    secondary: { type: String },
    tertiory: { type: String },
  },
}, { timestamps: true });

export default mongoose.model('Config', configSchema);
