
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({

    ctrlName: {
        type: String,
        required: true,
        default: null
    },
    ctrlEmail: {
        type: String,
        required: true,
        default: null
    },
    ctrlUsername: {
        type: String,
        required: true,
        default: null
    },
    ctrlPassword: {
        type: String,
        required: true,
        default: null
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: null,
        ref: "organisation"
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


module.exports = mongoose.model('ControllerUser', schema, 'ControllerUser');