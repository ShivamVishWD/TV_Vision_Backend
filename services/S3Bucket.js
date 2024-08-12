const AWS = require("aws-sdk");
const fs = require('fs');
require("dotenv").config();
 
const KEY_ID = process.env.AWS_S3_KEY_ID;
const SECRET_KEY = process.env.AWS_S3_SECRET_KEY;
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
 
const s3 = new AWS.S3({
    accessKeyId: KEY_ID,
    secretAccessKey: SECRET_KEY,
});

// -------- Parameters for Creating S3 Bucket on AWS
 
// const params = {
//     Bucket: BUCKET_NAME,
//     CreateBucketConfiguration: {
//         LocationConstraint: "ap-south-1"
//     }
// };
 
 
 
// --------- Bucket Creation Code
 
// s3.createBucket(params, function(err, data){
//     if (err) console.log(err, err.stack);
//     else console.log('Bucket Created Successfully', data.Location);
// });
 
 
const uploadFile = (fileDetail) => {
    try{
        // Read content from the file
        const fileContent = fs.readFileSync(fileDetail.path);
 
        // Setting up S3 upload parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileDetail.originalname, // File name you want to save as in S3
            Body: fileContent
        };
 
        // Uploading file to the bucket
        return new Promise((resolve, reject) => {
            s3.upload(params, function(err, data) {
            if (err) {
                return resolve({
                    status: 400,
                    message: err.code
                })
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            return resolve({
                status: 200,
                path: data.Location
            })
            })
        });
    }catch(error){
        console.log(error)
    }
};
 
module.exports = { uploadFile }