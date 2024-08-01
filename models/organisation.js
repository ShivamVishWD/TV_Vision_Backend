
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({

    orgName: {
        type: String,
        required: true,
        default: null
    },
    orgCode: {
        type: String,
        required: false,
        default: null
    },
    orgUsername: {
        type: String,
        required: true,
        default: null
    },
    orgPassword: {
        type: String,
        required: true,
        default: null
    },
    defaultData: [
        {
            type:new Schema({
             file_type:{
                 type:String,
                 required:true
             },
             file_url:{
                 type:String,
                 required:true
             },
             created_by: {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'ContollerUser',
             },
             updated_by: {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'ContollerUser',
             },
             isActive:{
                 type:String,
                 required: true,
                 default:'active',
             }
            },{
                 timestamps: true
            })
             
        }
    ],
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    isDelete: {
        type: Boolean,
        required: true,
        default: false
    }
    
},{
    timestamps: true
});


module.exports = mongoose.model('Organisation', schema, 'Organisation');