const crypto = require('crypto')
database = require('./db.js')

exports.genkey = function(timeperiod) {
    const apikey = crypto.randomBytes(16).toString('hex');
    const hashedkey = crypto.createHmac('sha256', "salt").update(apikey).digest('hex')

    return { apikey, hashedkey, timeperiod }
}

exports.hashApiKey = function(apikey) {
    const hashedkey = crypto.createHmac('sha256', "salt").update(apikey).digest('hex')

    return hashedkey
}

exports.validate = function(hashedkey) {
    // checks data base for hashed key
    if (database[hashedkey]) {
        keyinfo = database[hashedkey]
        howManySeconds = keyinfo.timeperiod * 60000 // times by 60000 because Date.now() is in milliseconds
        currenttimedif = Date.now() - keyinfo.timestamp

        if (currenttimedif >= howManySeconds) {
            database[hashedkey] = null // if the api key is too old then de activate it and delete
            return false
        } else {
            if (keyinfo.active == false) {
                database[hashedkey] = null // if its just already been inactivated then delete it
                return false
            }
        }
    } else {
        return false
    }

    // waits until the rest is done if so then return true
    return true
}