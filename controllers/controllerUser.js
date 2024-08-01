const helper = require('../helpers/Common');
const { HandleError } = require('../helpers/ErrorHandler');
const userCtrlModal = require("../models/controllerUser");
const moment = require('moment-timezone');

const collectionFields = {
    id: "_id",
    name: "ctrlName",
    email: "ctrlEmail",
    username: "ctrlUsername",
    password: "ctrlPassword",
    orgId: "orgId",
    active: "isActive",
    delete: "isDelete"
}

const userCtrl = {

    get: async(req, res) => {
        try{
            let filterObj = {}
            if(req.query && Object.keys(req.query).length > 0){
                for(let key in req.query)
                    filterObj[collectionFields[key]]= req.query[key]
            }

            filterObj = { ...filterObj, isActive: true, isDelete: false }
            
            const result = await userCtrlModal.find(filterObj);

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
            if(!req.body.email) mandatoryFields.push('email');
            if(!req.body.password) mandatoryFields.push('password');
            if(!req.body.orgId) mandatoryFields.push('orgId');
            
            if(mandatoryFields.length > 0)
                return res.status(200).json({status: 400, message: 'Mandatory Fields Error', fields: mandatoryFields});

            const getOrg = await userCtrlModal.find({ctrlEmail: req.body.email});
            if(getOrg && getOrg.length > 0)
                return res.status(200).json({status: 400, message: 'This User is already exist'});

            let body = {};
            for(let key in req.body){
                body[collectionFields[key]] = req.body[key];
            }
            body[collectionFields['username']] = String(req.body.name).toUpperCase().split(" ")[0]+"_"+helper.dateTimeRandom();

            const insertUser = await new userCtrlModal(body).save();
            if(insertUser)
                return res.status(200).json({status: 200, message: "User Saved", recordId: insertUser});
            else
                return res.status(400).json({status: 400, message: "Something went wrong"});
        }catch(error){
            console.log('error : ',error);
            return HandleError(error);
        }
    },

    update: async(req, res) => {
        try{
            let filterObj = {}
            if(req.query && Object.keys(req.query).length > 0){
                for(let key in req.query)
                    filterObj[collectionFields[key]]= req.query[key]
            }

            let body = {}
            if(req.body && Object.keys(req.body).length > 0){
                for(let key in req.body)
                    body[collectionFields[key]]= req.body[key]
            }

            const result = await userCtrlModal.findOneAndUpdate(filterObj, body, {new: true});

            return res.status(200).json({status: 200, message: 'Records Fetched', data: result});
        }catch(error){
            console.log('error : ',error);
            return HandleError(error);
        }
    },

    login: async(req, res) => {
        try{
            let mandatoryFields = [];
            if(!req.body.email) mandatoryFields.push('email');
            if(!req.body.password) mandatoryFields.push('password');
            
            if(mandatoryFields.length > 0)
                return res.status(200).json({status: 400, message: 'Mandatory Fields Error', fields: mandatoryFields});

            let filterObj = {};
            for(let key in req.body){
                filterObj[collectionFields[key]] = req.body[key];
            }

            const userRes = await userCtrlModal.findOne(filterObj).exec();
            if(userRes)
                return res.status(200).json({status: 200, message: "Record Fetched", record: userRes});
            else
                return res.status(200).json({status: 400, message: "Record not Fetched"})
        }catch(error){
            console.log('error : ',error);
            return HandleError(error);
        }
    }
}

module.exports = userCtrl;