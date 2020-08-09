import React, { useEffect, useState } from 'react';
import './App.css';
import { ParsedMail } from 'mailparser';
import MailList from './components/MailList';

const App = () => {

    const [mails, setMails] = useState<any>([]);
    const [mail, setMail] = useState<ParsedMail>();

    useEffect(() => {
        const fetchMails = async () => {
            const response = await fetch('/mail/');
            const mailsReceived = await response.json();
            console.log(mailsReceived);

            setMails(mailsReceived);
        };
        fetchMails();
    }, []);

    const fetchMail = async (mailSelected: string) => {
        const response = await fetch(`/mail/${mailSelected}`);
        console.log(response);
        const mailParsed = await response.json();
        setMail(mailParsed);
    }

    return (
        <div className="App">
            <MailList mails={mails} fetchMail={fetchMail} />

            <div>
                {mail &&
                    <>
                        From: <div dangerouslySetInnerHTML={{ __html: mail?.from?.html || '' }} />
                        To: <div dangerouslySetInnerHTML={{ __html: mail?.to?.html || '' }} />
                        At: <div>{mail?.date}</div>
                        <div dangerouslySetInnerHTML={{__html: mail.html || ''}}></div>
                    </>
                }
            </div>
        </div>
    );
}

    export default App;
