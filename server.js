const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.post('/subscribe', (req, res) => {
    if (req.body.captcha === undefined || req.body.captcha === '' || req.body.captcha === null) {
        return res.json({ "success": false, "msg": "please select captcha" })
    }

    const secretKey = '6LfEhJspAAAAAFNb5fnQlGMxPCHmZaBByeiuItGW';

    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body)

        if (body.success !== undefined && !body.success) {
            return res.json({ "success": false, "msg": "Failed captcha verification" })
        }

        return res.json({ "success": true, "msg": "Captcha passed" })
    })
})

app.listen(3000, () => {
    console.log('running server')
})