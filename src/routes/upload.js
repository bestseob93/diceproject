import express from 'express';
import multer from 'multer';
//import formidable from 'formidable';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/files');
  },
  filename(req, file, cb) {
    console.log('asdsads');
    console.log(file);
    cb(null,file.originalname);
  }
});

const upload = multer({
	storage: storage
});
router.post('/', upload.single('file'), (req, res) => {
	console.log(req.headers);
	console.log('----------');
	console.log(req.file);
	console.log('----------');
	console.log(req.files);
	res.json({ 'hello': 'world' });
});

export default router;
