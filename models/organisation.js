
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


module.exports = mongoose.model('organisation', schema, 'organisation');