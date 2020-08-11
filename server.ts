import { simpleParser } from 'mailparser';
import * as http from 'http';
import * as path from 'path';
import * as body from 'body-parser';
import * as AWS from 'aws-sdk';

import express from 'express';

AWS.config.update({region: 'eu-west-3'});

const app = express();
const server = http.createServer(app);
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

app.use(express.static(path.join(__dirname, 'build')));
app.use(body.json());

app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/mail/', async (req, res) => {
    const bucketParams = {
        Bucket: 'alaric.eu-mails',
        Prefix: 'mail-received'
    };

    const mailNames: any = await s3.listObjects(bucketParams).promise();
    const mails = [];
    for (const mailObject of mailNames.Contents) {
        const mailOptions = {
            Bucket: 'alaric.eu-mails',
            Key: mailObject.Key,
            ResponseContentType: 'text/plain'
        };
        const unparsedMail = await s3.getObject(mailOptions).promise();
        const parsedMail = await simpleParser(unparsedMail.Body.toString());
        mails.push({
            mailKey: mailObject.Key,
            parsed: parsedMail
        });
    }
    res.json(mails);
});

app.get('/delete/:messageKey', async (req, res) => {
    const messageKey = req.params.messageKey;
    const mailOptions = {
        Bucket: 'alaric.eu-mails',
        Key: `mail-received/${messageKey}`,
    };
    try {
        await s3.deleteObject(mailOptions).promise();
        res.json(200);
    }
    catch (e) {
        console.log(e);
        res.json(400);
    }
})

console.log('listening on 1234');
server.listen(1234);
