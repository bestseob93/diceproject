import express from 'express';
import fs from 'fs';

import Doctor from '../models/doctors';
import * as Generate from '../services/Generator';

const router = express.Router();


router.post('/register', (req, res, next) => {
  if(req.body.job === "" && typeof req.body.job !== 'string') {
    return res.status(422).json({
      error: "job null",
      code: 1
    });
  }

  if(req.body.doctorName === "" && typeof req.body.doctorName !== 'string') {
    return res.status(422).json({
      error: "name null",
      code: 2
    });
  }

  if(req.body.birth === "" && typeof req.body.birth !== 'string') {
    return res.status(422).json({
      error: "birth null",
      code: 3
    });
  }

  if(req.body.department === "" && typeof req.body.department !== 'string') {
    return res.status(422).json({
      error: "department null",
      code: 4
    });
  }

  Doctor.findOne({ doctorName: req.body.doctorName, birth: req.body.birth }, (err, exists) => {
    if(err) throw err;

    if(exists) {
      return res.status(419).json({
        error: "doctor is already exists",
        code: 5
      });
    }

    let doctorInfo = {
      doctorName: req.body.doctorName,
      doctorBirth: req.body.birth,
      timestamp: new Date().getTime()
    };

    Generate.toTokens(doctorInfo).then(token => {
      Generate.toBarcodes(token).then(image => {
        console.log(image);
        fs.writeFile(`./public/barcodes/doctors/${doctorInfo.doctorBirth}-${doctorInfo.timestamp}.png`, image, err => {
          if(err) throw err;

          let doctor = new Doctor({
            job: req.body.job,
            doctorName: req.body.doctorName,
            birth: req.body.birth,
            department: req.body.department,
            doctorBarcode: token
          });

          doctor.save(err => {
            if(err) throw err;
            console.log('success');
            return res.status(200).json({
              success: true,
              doctor
            });
          });
        });
      });
    });
  });
});

router.get('/', (req, res, next) => {
  let deToken = req.headers.authorization;
  let decodeResult = Generate.decodeToken(deToken);
  console.log(decodeResult);
  if(deToken === 'undefined' || deToken === '') {
    return res.status(422).json({
      error: "token is invalid",
      code: 0
    });
  }

  Doctor.findOne({ doctorName: decodeResult.doctorName, birth: decodeResult.doctorBirth }, (err, exists) => {
    if(err) throw err;

    if(!exists) {
      return res.status(419).json({
        error: "doctor is not registered",
        code: 1
      });
    }

    return res.status(200).json({
      success: true
    });

  });
});

export default router;
