import { ParsedMail } from 'mailparser';
import React from 'react';
import AttachmentsFooter from './components/AttachmentsFooter';

interface OwnProps {
    mail: ParsedMail;
}

const MailScreen = (props: OwnProps) => {
    return (
        <>
            <div style={{ width: '50vw' }} dangerouslySetInnerHTML={{ __html: props.mail.html || props.mail.textAsHtml || '' }}></div>
            {props.mail.attachments.length > 0 && <AttachmentsFooter attachments={props.mail.attachments} />}
        </>
    );
}

export default MailScreen;
