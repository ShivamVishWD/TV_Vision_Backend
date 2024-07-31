const { HandleError } = require('../helpers/ErrorHandler');
const tvModel = require('../models/tv');
const moment = require('moment-timezone');

const userCtrl = {
    getAllTV: async(req, res) => {
        try{
            let filter = {};
            if(req.query != null && req.query != undefined){
                for(let key in req.query){
                    filter[key] = req.query[key];
                }
            }

            const data = await tvModel.find(filter).populate({path:'created_by', select:"name"}).exec();
            
            let allData=[];

            for(let d of data){
                const cname = (d.created_by == undefined)?'':d.created_by.name;
                allData.push({
                    device_id:d.device_id,
                    device_name:d.device_name,
                    device_description:d.device_description,
                    orgId: d.orgId,
                    created_by:cname
                })
            }

            if(allData.length > 0)
                return res.status(200).json({status: 200, message: "Record fetched", data: allData});
            else
                return res.status(200).json({status: 400, message: "No Record Found"});
        }catch(error){
            console.log("error : ",error);
            return HandleError(error);
        }
    },

    updateTv: async(req, res) => {
        try{

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

            const updateObj = await tvModel.findByIdAndUpdate(filter, body, {new: true}).exec();

            if(updateObj)
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
            let fullUrl="http://192.168.18.116:5001/uploads/";
            let filter = {};
            if(req.query != null && req.query != undefined){
                for(let key in req.query){
                    filter[key] = req.query[key];
                }
            }

            const data = await tvModel.find(filter).populate({path:"data.created_by", select:"name"});
            if(data && data.length > 0)
                return res.status(200).json({status: 200, message: "Record Fetched", baseUrl: fullUrl, data});
            else
                return res.status(200).json({status: 400, message: "Record Not Fetched"});
        }catch(error){
            console.log("error : ",error);
            return HandleError(error);
        }
    },

    getOneTVData: async(req, res) => {
        try{
            let fullUrl="http://192.168.18.116:5001";

            if(req.body.device_id != undefined && req.body.device_id != null && String(req.body.device_id).length > 0){
                const getTv = await tvModel.findOne({device_id:req.body.device_id});
                console.log('getTv : ',getTv)
                if(!getTv){

                    const dataAdd= await new tvModel({
                        device_name:req.body.device_name ? req.body.device_name : 'New TV',
                        device_description: '',
                        data: [],
                        device_id:req.body.device_id
                    }).save();
                    console.log('result tv dataAdd : ', dataAdd)
                    res.json({status:200,data:{fileType:'Not Exists'}})
                    return;
                }else{

                    if(getTv.data.length>0){
                        
                        let allData={
                            fileType:getTv.data[0].file_type,
                            fileUrlList:[]
                        }

                        for(let d of getTv.data){
                            allData.fileUrlList.push(fullUrl+"/uploads/"+d.file_url)
                        }
                    res.json({status:200,data:allData})

                    }else{
                        res.json({status:200,data:{}, message:"Data not found !!"})
                    }
                    

                }
                
            }else{
                return res.status(200).send({status: 400, message: 'Device id is required'});
            }
        }catch(error){
            console.log("error : ",error);
            return HandleError(error);
        }
    },

    addTvData: async(req, res) => {
        try{
            if(req.originalUrl != '/api/tv/post/data/base'){
                console.log('req.body : ',req.body);
                console.log('req.file ', req.file)
                let deviceId = String(req.body.device_list).split(';');
                console.log('device Ids : ', deviceId)
                let arr = [{
                    file_type: req.body.type,
                    created_by: req.body.created_by,
                    updated_by: req.body.created_by,
                    file_url: req.file.filename,
                }];
                const addData = await tvModel.updateMany({device_id: {$in: deviceId}}, {data: arr});
                if(addData)
                    return res.status(200).json({status: 200, mesage:'Record Added !!'})
                else
                    return res.status(200).json({status: 400, mesage:'Something Wrong'})
                
            }else if(req.originalUrl != '/api/tv/post/data'){
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
                    obj['file_url'] = name;
                    arr.push(obj);
                }
                await tvModel.updateMany({device_id: {$in: req.body.device_list}}, {data: arr})
                return res.status(200).json({status: 200, mesage:'Record Added !!'});        
            }
        }catch(error){
            console.log("error : ",error);
            return HandleError(error);
        }
    },

    addTv: async(req, res) => {
        try{
            const dataAdd= new tvModel({
                device_name: req.body.device_name,
                device_id:req.body.device_id,
                device_description: '',
                orgId: req.body.orgId
            })
            await dataAdd.save();
        
            console.log('originalUrl '+ req.originalUrl)
            if(req.originalUrl == '/api/tv/register'){
                return res.status(200).send({status: 200, message:'Record Added !!'})
            }
        }catch(error){
        console.log("error : ",error);
        return HandleError(error);
        } 
    }
}

module.exports = userCtrl;