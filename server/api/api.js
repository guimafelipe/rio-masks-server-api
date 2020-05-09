const express = require('express');
const geo = require('./geolocator');
const nodemailer = require('nodemailer');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth:  {
        user:'f.guima@hotmail.com',
        pass: process.env.EMAIL_PASS
    }
});

let mailOptions = {
    from: 'f.guima@hotmail.com',
    to: 'guima.felipec@gmail.com',
    subject: 'Nova loja adicionada',
    text: undefined
}

const router = express.Router();

// Get Posts

router.get('/location', async (req, res) => {
   let address = req.query.address; 
   console.log("Bairro: "+ JSON.stringify(req.query));
   address += " Rio de janeiro"
   console.log(address);
   try {
    let ans = await geo.getCoord(address);
    res.send(ans);
   } catch (error) {
    console.log(error);
    res.status(500).send(error);
   }
});

router.get('/stores', async (req, res) => {
    await geo.localize();
    let tosend = await readFile(__dirname + '/mapinfo.json', 'utf8');
    tosend = JSON.parse(tosend);
    res.send(tosend.stores);
});

// Add posts

router.post('/stores', async (req, res) => {
    console.log(req.body);
    mailOptions.text = JSON.stringify(req.body, null, 4);
    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err);
        } else {
            console.log("Foi: " + info.response);
        }
    });
    res.status(201).send();
});

module.exports = router;