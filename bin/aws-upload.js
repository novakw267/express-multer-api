'use strict';

require('dotenv').load();
const AWS = require('aws-sdk');
// requiring the amazon storage
const s3 = new AWS.S3();
const fs = require('fs');

let file = {
  // the path of the file we're trying to stream
  path: process.argv[2],
  title: process.argv[3]
};

// command for setting up the stream
let stream = fs.createReadStream(file.path)

console.log("stream is ", stream);

// the params that we need to include for upload.
let params = {
  ACL: 'public-read',
  Bucket: process.env.AWS_S3_BUCKET_NAME,
  Key: file.title,
  Body: stream
};

// calling the params to upload to our bucket,
//  the function next to params is a call back
//
s3.upload(params, function(err, data) {
  console.log(err, data);
});
