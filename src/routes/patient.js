import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import multer from 'multer';

import Patient from '../models/patients';
import Bed from '../models/bed';

import * as Generate from '../services/Generator';

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

router.post('/upload', upload.single('boxcam'), (req, res, next) => {
    let bedId = req.headers.authorization;
    Bed.findOne({beduuid: bedId}, (err, bed) => {
      Patient.findOne({ bed: bed.beduuid }, (err, patient) => {
        if(err) throw err;
        if(!patient) {
          return res.status(422).json({
            error: "patient does not exists",
            code: 1
          });
        }

        if(req.file === undefined) {
          return res.status(422).json({
            error: "VIDEO DOES NOT RECORDED",
            code: 2
          });
        }

        let recordFile = './public/files/' + req.file.filename;

        patient.recordFiles.push(recordFile);
        patient.save(err => {
          if(err) throw err;
          return res.status(200).json({
            success: true
          });
        });
      });
    });
});

router.post('/register', (req, res, next) => {
  if(req.body.patientName === '' || typeof req.body.patientName !== 'string') {
    return res.status(422).json({
      error: "patient name does not filled",
      code: 1
    });
  }

  if(req.body.patientBirth === '' || typeof req.body.patientBirth !== 'string') {
    return res.status(422).json({
      error: "patient birth does not filled",
      code: 2
    });
  }

  if(req.body.address === '' || typeof req.body.address !== 'string') {
    return res.status(422).json({
      error: "address does not filled",
      code: 3
    });
  }

  if(req.body.bloodType === '' || typeof req.body.bloodType !== 'string') {
    return res.status(422).json({
      error: "blood type does not filled",
      code: 4
    });
  }

  Patient.findOne({patientName: req.body.patientName, birth: req.body.patientBirth, bloodType: req.body.bloodType}, (err, exists) => {
    if(err) throw err;

    if(exists) {
      return res.status(422).json({
        error: "patient already exists",
        code: 0
      });
    }

    let patientInfo = {
      patientName: req.body.patientName,
      patientBirth: req.body.patientBirth,
      timestamp: new Date().getTime()
    };

    Generate.toTokens(patientInfo).then(token => {
      Generate.toBarcodes(token).then(image => {
        console.log(image);
        fs.writeFile(`./public/barcodes/patients/${patientInfo.doctorBirth}-${patientInfo.timestamp}.png`, image, err => {
          if(err) throw err;

          let patient = new Patient({
            patientName: req.body.patientName,
            birth: req.body.patientBirth,
            address: req.body.address,
            bloodType: req.body.bloodType,
            patientBarcode: token
          });

          patient.save(err => {
            if(err) throw err;

            return res.status(200).json({
              success: true,
              patient_id: patient._id
            });
          });
        });
      });
    });
  });
});

router.post('/moreInfo', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(422).json({
      error: "invalid id",
      code: 0
    });
  }

  if(req.body.chargeDoctor === '' || typeof req.body.chargeDoctor !== 'string') {
    return res.status(422).json({
      error: "chargeDoctor is not defined",
      code: 1
    });
  }

  if(req.body.bed === '' || typeof req.body.bed !== 'string') {
    return res.status(422).json({
      error: "bed is not defined",
      code: 2
    });
  }

  Patient.findById('')


});

export default router;
