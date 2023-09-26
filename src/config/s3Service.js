const { S3 } = require("aws-sdk")
const uuid = require('uuid').v4

exports.s3Uploadv2 = async (file) => {
  const s3 = new S3()

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${uuid()}-${file.originalname}`,
    Body: file.buffer,
  }

  return await s3.upload(params).promise()
}

exports.s3Deletev2 = async (key) => {
  const s3 = new S3();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

    await s3.deleteObject(params).promise();
};




