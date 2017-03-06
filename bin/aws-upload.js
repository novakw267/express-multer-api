'use strict';

require('dotenv').load();
const AWS = require('aws-sdk');
// requiring the amazon storage
const s3 = new AWS.S3();
const fs = require('fs');
// requiring the files to use mime which we installed via npm
// it will allow things we upload to the amazing server to figure out
// the file type
const mime = require('mime');
const path = require('path');
const crypto = require('crypto');

let file = {
  // the path of the file we're trying to stream
  path: process.argv[2],
  title: process.argv[3]
};

// This will find out what type of file we uploaded
let mimeType = mime.lookup(file.path);
// and get rid of the extention
let ext = path.extname(file.path);

// command for setting up the stream
let stream = fs.createReadStream(file.path);
// setting new Date( with no params gives todays date)
// this puts that into an array with the time
// the .split puts forces only the first part to return
let folder = (new Date()).toISOString().split('T')[0];

// this decided whether or a promise succeds or gets rejected.
new Promise((resolve, reject) => {
  // we use randomBytes to get our file name
    crypto.randomBytes(16, (error, buffer) => {
      if (error) {
        // if error the promoise gets rejected and log the error
        reject(error);
      } else {
        console.log("buffer is ", buffer);
        console.log("buffer.toS is ", buffer.toString('hex'));
        resolve(buffer.toString('hex'));
      }
    });
  })
  // this is why we call the params filename becuase thats what it is
  .then((filename) => {
    // filename is what the promise returns
    // if there is an error nothing happens here
    let params = {
      ACL: 'public-read',
      ContentType: mimeType,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${folder}/${filename}${ext}`,
      Body: stream
    };

    // calling the params to upload to our bucket,
    //  the function next to params is a call back
    // this allows the return or the rejection of the new promise
    return new Promise((resolve, reject) => {
      // promisifying this allows us to return a promise with the
      // resolved data
      s3.upload(params, function(error, data) {
        if (error) {
          // console.log(error);
          reject(error);
        } else {
          // console.log(data);
          resolve(data);
        }
      });
    });

  })
  .then(console.log)
  .catch(console.error);
//
