const pool = require('../db');
const bcrypt = require('bcrypt');

class Mpin {
    constructor(mobile_number, mpin) {
        this.mobile_number = mobile_number;
        this.mpin = mpin;
    }

    static update(mobileNumber, mpin, callback) {
        // Validate that the new MPIN is exactly 4 digits
        console.log(mobileNumber);
        console.log(mpin);
        if (!/^\d{4}$/.test(mpin)) {
            return callback(new Error('MPIN must be a 4-digit number'), null);
        }

        // Hash the new MPIN
        bcrypt.hash(mpin, 10, (hashError, hashedMpin) => {
            if (hashError) {
                return callback(hashError, null);
            }

            // Update the MPIN in the database
            pool.query('UPDATE tbappuser SET mpin = ? WHERE mobile_number = ?', [hashedMpin, mobileNumber], (error, result) => {
                if (error) {
                    return callback(error, null);
                }
                callback(null, result.affectedRows > 0);
            });
        });
    }

    
    };

module.exports = Mpin;
