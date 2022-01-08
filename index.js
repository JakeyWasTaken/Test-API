const express = require('express')
const app = express()
const port = 8080

database = require('./db.js')
keygen = require('./keysys.js')

// just returns 404 if blank
app.get('/', (req, res) => {
    res.send("<b>404 not found, please check <a href='http://localhost:8080/api/documentation'>/api/documentation instead")
})

// used to generate a key
app.get('/genkey', (req, res) => {
    const tp = req.query.tp

    if (tp != "1" && tp != "60") {
        res.send("<b> Time period needs to be this format ?tp = 60 or 1")
        return
    }
    // generates api key salt and hashed api key
    const genkey = keygen.genkey
    const keyData = genkey(tp)

    // saves api key length and time stamp
    const apikey = keyData.apikey
    const hashedkey = keyData.hashedkey

    database[hashedkey] = { 'active': true, 'hashedkey': hashedkey, 'timeperiod': tp, 'timestamp': Date.now() }
    res.send("Your api key: <b>" + apikey + "</b> this lasts for " + tp + " minute(s)")
})

// used to validate an api key 
app.get('/validate', (req, res) => {
    const apikey = req.query.apikey
    const validate = keygen.validate
    const hash = keygen.hashApiKey

    console.log(apikey)

    if (!apikey) {
        res.send("No api key passed through")
        return
    }

    hashed = hash(apikey)
    isValid = validate(hashed)

    if (isValid == true) {
        res.send("Your api key is still valid")
    } else {
        res.send("Your api key is not valid")
    }
})

// waits for a get request
app.get('/api/get', (req, res) => {
    const apikey = req.query.apikey
    const validate = keygen.validate
    const hash = keygen.hashApiKey

    if (!apikey) {
        res.send("No api key passed through")
        return
    }

    hashed = hash(apikey)
    isValid = validate(hashed)

    if (isValid == false) {
        res.send("Your api key is not valid")
    }

    res.send("Congrats you have logged into my useless api")
})

// listens on the designated port
app.listen(port, () => console.log('Listening on port ', port, '!'))