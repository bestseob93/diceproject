import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const bloodTypes = ['A', 'B', 'AB', 'O'];

const Patient = new Schema({
	patientName: { type: String, required: true },
	brith: { type: Date, required: true },
	address : { type: String, required: true },
	bloodType: { type: String, enum: bloodTypes },
	chargeDoctor: { type: String, ref: 'doctor'},
	bed: { type: String, ref: 'bed'},
	disease: String,
	date: {
		Admission: Date.now()
	},
	patientBarcode: String,
	recordFiles: [String],
	care: [{ type: String, ref: 'medicalcare'}]
});

export default mongoose.model('patient', Patient);
// 환자 정보
// name : String
// birth : String
// address : String
// bloodType : String
// chargeDoctor : String
// bed : String
// room : String
// disease : String
// Date : Date
// barcordID : String
// recordFile : [String]
// Drug : String
