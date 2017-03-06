'use strict';

require('dotenv').load();

const s3Upload = require('../lib/s3-upload');
const Upload = require('../app/models/upload');
const mongoose = require('../app/middleware/mongoose');

// Upload.create(title, url);

let file = {
  // the path of the file we're trying to stream
  path: process.argv[2],
  title: process.argv[3]
};

// returns a promise, and some data.
s3Upload(file)
.then((s3Response) => {
  // get the url
  let url = s3Response.Location;
  return Upload.create({
    title: file.title,
    url: url
  });
})
.then(console.log)
.catch(console.error)
.then(() => mongoose.connection.close());
