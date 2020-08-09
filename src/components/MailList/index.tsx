import React from 'react';

interface OwnProps {
    mails: string[];
    fetchMail: (m: string) => void;
}

const MailList = (props: OwnProps) => {
    return (
        <ul>
            {props.mails.map((m: string) => {
                return <li key={m} onClick={() => props.fetchMail(m)}>{m}</li>
            })}
        </ul>
    )
}

export default MailList;
