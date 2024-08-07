const { HandleError } = require('../helpers/ErrorHandler');
const tvModel = require('../models/tv');
const moment = require('moment-timezone');
require('dotenv').config();

const userCtrl = {
    getAllTV: async(req, res) => {
        try{

            if(Object.keys(req.query).length < 1)
                return res.status(200).json({status: 400, message: "need a orgId to get TV list"});

            let mandatoryFilter = [];
            if(!req.query.orgId) mandatoryFilter.push("orgId");

            if(mandatoryFilter.length > 0)
                return res.status(200).json({status: 400, message: "Mandatory query missing for update", queries: mandatoryFilter});

            let filter = {};
            if(req.query != null && req.query != undefined){
                for(let key in req.query){
                    filter[key] = req.query[key];
                }
            }
            console.log(filter, 'filter')
            const data = await tvModel.find(filter).exec();
            
            if(data.length > 0)
                return res.status(200).json({status: 200, message: "Record fetched", data});
            else
                return res.status(200).json({status: 400, message: "No Record Found"});
        }catch(error){
            console.log("error : ",error);
            return HandleError(error);
        }
    },

    updateSingleTv: async(req, res) => {
        try{

            if(Object.keys(req.query).length < 1)
                return res.status(200).json({status: 400, message: "send some filter as a query to update tv data"});

            if(Object.keys(req.body).length < 1)
                return res.status(200).json({status: 400, message: "Request body cannot be empty"});

            let mandatoryFilter = [];
            if(!req.query.orgId) mandatoryFilter.push("orgId");
            if(!req.query.device_id) mandatoryFilter.push("device_id");

            if(mandatoryFilter.length > 0)
                return res.status(200).json({status: 400, message: "Mandatory query missing for update", queries: mandatoryFilter});

            let filter = {};
            if(req.query != null && req.query != undefined){
                for(let key in req.query){
                    filter[key] = req.query[key];
                }
            }

            let body = {};
            if(req.body != null && req.body != undefined){
                for(let key in req.body){
                    body[key] = req.body[key];
                }
            }

            const updateObj = await tvModel.findOneAndUpdate(filter, body, {new: true}).exec();
            if(updateObj._id)
                return res.status(200).json({status: 200, message: "Record updated"});
            else
                return res.status(200).json({status: 400, message: "Record not update"});

        }catch(error){
            console.log("error : ",error);
            return HandleError(error);
        }
    },

    getAllTVData: async(req, res) => {
        try{
            let filter = {};
            if(req.query != null && req.query != undefined){
                for(let key in req.query){
                    filter[key] = req.query[key];
                }
            }

            const data = await tvModel.find(filter).populate({path:"data.created_by", select:"name"});
            if(data && data.length > 0)
                // return res.status(200).json({status: 200, message: "Record Fetched", baseUrl: `${process.env.FILE_BASE_URL}/uploads/`, data});
                return res.status(200).json({status: 200, message: "Record Fetched", data});
            else
                return res.status(200).json({status: 400, message: "Record Not Fetched"});
        }catch(error){
            console.log("error : ",error);
            return HandleError(error);
        }
    },

    getOneTVData: async(req, res) => {
        try{

            let mandatoryFields = [];
            if(!req.body.device_id) mandatoryFields.push("device_id");
            if(!req.body.orgId) mandatoryFields.push("orgId");

            if(mandatoryFields.length > 0)
                return res.status(200).json({status: 400, message: "mandatory fields missing", fields: mandatoryFields})

            const getTv = await tvModel.findOne({orgId: req.body.orgId, device_id:req.body.device_id});
            // console.log('getTv : ',getTv)
            if(getTv){
                let allData={
                    fileType:getTv.data.length>0 && getTv.data[0].file_type,
                    fileUrlList:[]
                }

                for(let d of getTv.data){
                    allData.fileUrlList.push(process.env.FILE_BASE_URL+"/uploads/"+d.file_url)
                }
                return res.status(200).json({status:200,data:allData})  
            }
        }catch(error){
            console.log("error : ",error);
            return HandleError(error);
        }
    },

    addTvData: async(req, res) => {
        try{
            const protocol = req.protocol;
            const host = req.get('host');
            const baseUrl = `${protocol}://${host}`;
            const fullUrl = `${baseUrl}/uploads/`;
            if(req.originalUrl == '/api/tv/post/data'){
                console.log('req.body : ',req.body);
                console.log('req.file ', req.file)
                let deviceId = String(req.body.device_list).includes(";") ? String(req.body.device_list).split(';') : [req.body.device_list];
                console.log('device Ids : ', deviceId)
                let arr = [{
                    file_type: req.body.type,
                    created_by: req.body.created_by,
                    updated_by: req.body.created_by,
                    file_url: fullUrl+req.file.filename,
                }];
                const addData = await tvModel.updateMany({orgId: req.body.orgId, device_id: {$in: deviceId}}, {data: arr}, {new: true});
                if(addData.modifiedCount > 0){
                    // const event = req.app.get("event-emitter");
                    // event.emit("refresh-images", req.body.orgId);
                    return res.status(200).json({status: 200, message:'Record Added !!'})
                }else
                    return res.status(200).json({status: 400, message:'Something Wrong'})
            }else if(req.originalUrl == '/api/tv/post/data/base'){
                console.log('req.body : ',req.body);
                let arr = [];
                for(let item of req.body.data_list){
                    let obj = {};
                    obj['file_type'] = req.body.type;
                    obj['created_by'] = req.body.created_by;
                    obj['updated_by'] = req.body.created_by;
                    const base64Data = String(item.base64).replace(/^data:image\/png;base64,/, "");
                    const name = Date.now()+'-'+item.file_name;
                    require("fs").writeFile("./public/uploads/"+name, base64Data, 'base64', function(err) {
                    console.log(err);
                    });
                    obj['file_url'] = fullUrl+name;
                    arr.push(obj);
                }
                const addData = await tvModel.updateMany({device_id: {$in: req.body.device_list}}, {data: arr})
                if(addData.modifiedCount > 0){
                    // const event = req.app.get("event-emitter");
                    // event.emit("refresh-images", req.body.orgId);
                    return res.status(200).json({status: 200, message:'Record Added !!'})
                }else
                    return res.status(200).json({status: 400, message:'Something Wrong'})
            }
        }catch(error){
            console.log("error : ",error);
            return HandleError(error);
        }
    },

    addTv: async(req, res) => {
        try{
            let mandatoryFields = [];
            if(!req.body.device_id) mandatoryFields.push("device_id");
            if(!req.body.device_name) mandatoryFields.push("device_name");
            if(!req.body.orgId) mandatoryFields.push("orgId");

            if(mandatoryFields.length > 0)
                return res.status(200).json({status: 400, message: "Mandatory fields", fields: mandatoryFields});

            const getDevice = await tvModel.findOne({device_id: req.body.device_id, orgId: req.body.orgId});
            if(getDevice)
                return res.status(200).json({status: 400, message: "Duplicate Device Id in this Org"});

            const dataAdd= new tvModel({
                device_name: req.body.device_name,
                device_id:req.body.device_id,
                device_description: '',
                orgId: req.body.orgId
            })
            let record = await dataAdd.save();
        
            console.log('originalUrl '+ req.originalUrl)
            if(req.originalUrl == '/api/tv/register')
                return res.status(200).send({status: 200, message:'Record Added !!', record: record})
        }catch(error){
            console.log("error : ",error);
            return HandleError(error);
        } 
    }
}

module.exports = userCtrl;