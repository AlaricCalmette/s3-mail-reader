import { simpleParser } from 'mailparser';
import * as fs from 'fs';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as body from 'body-parser';
import * as AWS from 'aws-sdk';

AWS.config.update({region: 'eu-west-3'});

const app = express();
const server = http.createServer(app);
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

app.use(express.static(path.join(__dirname, 'build')));
app.use(body.json());

app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.get('/mail/:id', async (req: any, res) => {
    const id = req.params.id;

    const mailOptions = {
        Bucket: 'alaric.eu-mails',
        Key: `mail-received/${id}`,
        ResponseContentType: 'text/plain'
    };
    await s3.getObject(mailOptions, async (err, data) => {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            const mail = await simpleParser(data.Body.toString());
            res.json(mail);
        }
    });

});

app.get('/mail/', (req, res) => {
    const bucketParams = {
        Bucket: 'alaric.eu-mails',
        Prefix: 'mail-received'
    };
    s3.listObjects(bucketParams, (err, data) => {
        if (err) {
          console.log("Error", err);
        } else {
            const mailNames = data.Contents.map((content) => {
                return content.Key.split('/')[1];
            });

            res.json(mailNames);
        }
    });
});

console.log('listening on 1234');
server.listen(1234);
