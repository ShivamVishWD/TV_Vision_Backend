const { HandleError } = require('./ErrorHandler');

const Validation = {

    checkEmail: (email) => {
        try{
            const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi;
            return regex.test(email);
        }catch(error){
            return HandleError(error);
        }
    },

    checkMoile: (mobile) => {
        try{
            const regex = /^\d+$/;
            return regex.test(mobile)
        }catch(error){
            return HandleError(error);
        }
    },

    checkLength: (data, length) => {
        try{
            return (String(data).length <= length);
        }catch(error){
            return HandleError(error);
        }
    }

}

module.exports = Validation;