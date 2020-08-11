import React, { useEffect, useState } from 'react';
import './App.css';
import { ParsedMail } from 'mailparser';
import MailList from './components/MailList';
import { toaster } from 'evergreen-ui';

const App = () => {

    const [mails, setMails] = useState<{ parsed: ParsedMail; mailKey: string}[]>([]);
    const [mail, setMail] = useState<ParsedMail>();

    const fetchMails = async () => {
        const response = await fetch('/mail/');
        const mailsReceived = await response.json();

        setMails(mailsReceived);
    };

    const deleteMail = async (mailKey: string) => {
        const response = await fetch(`/delete/${mailKey}`);
        if (response.ok) {
            toaster.success('Mail exterminé!');
            const remainingMails = [...mails];
            remainingMails.splice(mails.findIndex((mail) => mail.mailKey === `mail-received/${mailKey}`), 1);
            setMails(remainingMails);
        }
        else {
            toaster.success('Le mail a resisté à l\'extermination!');
        }
        await fetchMails();
    }

    useEffect(() => {
        fetchMails();
    }, []);

    return (
        <div className="App">
            <MailList mails={mails} fetchMail={setMail} deleteMail={deleteMail} />
            { mail && <div style={{width: '20vw'}} dangerouslySetInnerHTML={{__html: mail.html || ''}}></div> }
        </div>
    );
}

    export default App;
