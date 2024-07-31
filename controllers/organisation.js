const { HandleError } = require('../helpers/ErrorHandler');
const orgModal = require('../models/organisation');
const moment = require('moment-timezone');

const collectionFields = {
    id: "_id",
    name: "orgName",
    code: "orgCode",
    username: "orgUsername",
    password: "orgPassword",
    active: "isActive",
    delete: "isDelete"
}

const orgCtrl = {

    get: async(req, res) => {
        try{
            let filterObj = {}
            if(req.query && Object.keys(req.query).length > 0){
                for(let key in req.query)
                    filterObj[collectionFields[key]]= req.query[key]
            }

            if('isActive' in filterObj && 'isDelete' in filterObj)
                filterObj = { ...filterObj }
            else if('isActive' in filterObj)
                filterObj = { ...filterObj, isDelete: false }
            else if('isDelete' in filterObj)
                filterObj = { ...filterObj, isActive: true }
            else
                filterObj = { ...filterObj, isActive: true, isDelete: false }
            
            const result = await orgModal.find(filterObj);

            return res.status(200).json({status: 200, message: 'Records Fetched', data: result});
        }catch(error){
            console.log('error : ',error)
            return HandleError(error)
        }
    },

    insert: async(req, res) => {
        try{
            let mandatoryFields = [];
            if(!req.body.name) mandatoryFields.push('name');
            if(!req.body.username) mandatoryFields.push('username');
            if(!req.body.password) mandatoryFields.push('password');
            
            if(mandatoryFields.length > 0)
                return res.status(200).json({status: 400, message: 'Mandatory Fields Error', fields: mandatoryFields});

            const getOrg = await orgModal.find({orgName: req.body.name, orgUsername: req.body.username});
            if(getOrg && getOrg.length > 0)
                return res.status(200).json({status: 400, message: 'This Organisation is already exist'});

            let body = {};
            for(let key in req.body){
                body[collectionFields[key]] = req.body[key];
            }

            body[collectionFields['code']] = generateUniqueCode(body);

            const insertOrg = await new orgModal(body).save();
            if(insertOrg)
                return res.status(200).json({status: 200, message: "Organisation Saved", recordId: insertOrg.id});
            else
                return res.status(400).json({status: 400, message: "Something went wrong"});
        }catch(error){
            console.log('error : ',error);
            return HandleError(error);
        }
    },

    login: async(req, res) => {
        try{
            let mandatoryFields = [];
            if(!req.body.username) mandatoryFields.push('username');
            if(!req.body.password) mandatoryFields.push('password');
            
            if(mandatoryFields.length > 0)
                return res.status(200).json({status: 400, message: 'Mandatory Fields Error', fields: mandatoryFields});

            const acceptedKey = ["username", "password"];
            let unacceptedKey = [];
            const keys = Object.keys(req.body);
            for (const key of keys) {
                if (!acceptedKey.includes(key)) {
                    unacceptedKey.push(key);
                }
            }

            if(unacceptedKey.length > 0)
                return res.status(200).json({status: 400, message: "Unaccepted Fields", fields: unacceptedKey});

            let filterObj = {};
            for(let key in req.body){
                filterObj[collectionFields[key]] = req.body[key];
            }

            const getOrg = await orgModal.findOne(filterObj).exec();
            if(getOrg)
                return res.status(200).json({status: 200, message: "Record Fetched", data: getOrg })

        }catch(error){
            console.log('error : ',error);
            return HandleError(error);
        }
    }
}

function generateUniqueCode(orgObject) {
    const { orgName, orgUsername, orgPassword } = orgObject;
    
    // Extract parts of the orgName and orgUsername
    const namePart = orgName.split(" ")[0].toUpperCase(); // First 3 letters of orgName
    const usernamePart = orgUsername.split("@")[0].toUpperCase(); // First 3 letters of orgUsername
    
    // Generate a random number between 1000 and 9999
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    
    // Combine parts to create the unique code
    const uniqueCode = `${namePart}${randomNumber}${usernamePart}`;
    
    // Ensure the length of the unique code is between 10-12 characters
    if (uniqueCode.length < 10) {
        return uniqueCode.padEnd(10, '0'); // Pad with zeros if less than 10 characters
    } else if (uniqueCode.length > 12) {
        return uniqueCode.substring(0, 12); // Trim to 12 characters if more than 12
    }
    
    return uniqueCode;
}

module.exports = orgCtrl;