import { DownloadIcon } from 'evergreen-ui';
import { Attachment } from 'mailparser';
import React from 'react';
import { AttachmentButton, Footer } from './styles';

interface OwnProps {
    attachments: Attachment[];
}

const AttachmentsFooter = (props: OwnProps) => {
    const downloadFile = (attachment: Attachment) => {
        const blob = new Blob([new Uint8Array((attachment.content as any).data)], {type: attachment.contentType});
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        const fileName = attachment.filename || 'sans nom';
        link.download = fileName;
        link.click();
    }
    return (
        <Footer>
            {
                props.attachments.map((attachment) => {
                    return (
                        <AttachmentButton iconAfter={DownloadIcon} onClick={() => downloadFile(attachment)}>{attachment.filename}</AttachmentButton>
                    )
                })
            }
        </Footer>
    )
}

export default AttachmentsFooter
