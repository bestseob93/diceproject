import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Medicalcare = new Schema({
	caretype: String,
	drug: {
		drugName: String,
		drugImageUrl: String,
		drugBarcode: String
	},
	inject: {
		injectName: String,
		injectAmount: String,
		injectBarcode: String
	},
	medicalInfo: String
});

export default mongoose.model('medicalcare', Medicalcare);
// 약 정보

// drugName : String
// drugBacord : String
// drugImageUrl : String


