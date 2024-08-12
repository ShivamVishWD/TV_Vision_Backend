
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({

    device_id: {
        type:Array,
        required: true
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
    scheduledDateTime: {
        type: String,
        required: false,
        default: ""
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


module.exports = mongoose.model('ScheduleData', schema, 'ScheduleData');