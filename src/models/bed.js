import mongoose from 'mongoose';

const Schema = mongoose.Schema();

const bed = new Schema({
  beduuid: { type: String, required: true },
  isChecked: { type: Boolean }
});

export default mongoose.model('Bed', bed);
