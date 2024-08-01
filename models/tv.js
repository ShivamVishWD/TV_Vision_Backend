
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({

    device_name:  {
        type:String,
        required: true,
    },
    device_id: {
        type:String,
        required: true
    },
    device_description: {
        type: String,
        required: false,
    },
    isActive:{
        type: Boolean,
        required: true,
        default: true,
    },
    isDelete: {
        type: Boolean,
        required: true,
        default: false
    },
    data:[
           {type:new Schema({
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
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: null,
        ref: 'Organisation'
    }
    
},{
    timestamps: true
});


module.exports = mongoose.model('TV', schema, 'TV');