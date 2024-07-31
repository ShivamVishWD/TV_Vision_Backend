const jwt = require('jsonwebtoken');
require('dotenv/config');
const { HandleError } = require('../helper/ErrorHandler');

const token = {

    generateToken: async(data) => {
        try{
            const token = jwt.sign(
                data, process.env.JWT_TOKEN, { expiresIn: "1d" }
            )
            return { status: 200, message: 'Token Genrated', token };
        }catch(error){
            return HandleError(error)
        }
    },

    verifyToken: async(req, res, next) => {
        try{
            const regex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/;
            let token = req.headers["authorization"];
            if(String(token).includes('Bearer'))
                token = String(token).replace(/^Bearer\s+/i, '');
            if(!token)
                return res.json({ status: 403, message: "A Token is required for authentication" });
            else if(regex.test(token)){
                jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
                    if (err) {
                        if (err.name === 'TokenExpiredError') {
                            return res.status(401).json({ status: 401, message: 'Token expired' });
                        } else {
                            return res.status(403).json({ status: 403, message: 'Failed to authenticate token' });
                        }
                    } else {
                        req.authData = decoded;
                    }
                });
            }else{
                return res.json({ status: 403, message: 'You passed wrong format of token' });
            }
        }catch(error){
            return HandleError(error)
        }
        return next();
    }

}

module.exports = token;