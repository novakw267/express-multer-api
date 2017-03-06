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

// the params that we need to include for upload.
let params = {
  ACL: 'public-read',
  ContentType: mimeType,
  Bucket: process.env.AWS_S3_BUCKET_NAME,
  Key: `${file.title}${ext}`,
  Body: stream
};

// calling the params to upload to our bucket,
//  the function next to params is a call back
//
s3.upload(params, function(err, data) {
  console.log(err, data);
});
