import { ParsedMail } from 'mailparser';
import React, { useState } from 'react';
import { MailListTable } from './styles';
import {
    Button,
    Table,
} from 'evergreen-ui';

interface OwnProps {
    mails: { parsed: ParsedMail; mailKey: string}[];
    fetchMail: (mail: ParsedMail) => void;
    deleteMail: (mailKey: string) => void;
}

const MailList = (props: OwnProps) => {
    const [selected, setSelected] = useState<ParsedMail>();

    const handleSelection = (mail: ParsedMail) => {
        setSelected(mail);
        props.fetchMail(mail);
    }

    const handleDelete = (event: any, mailKey: string) => {
        event.stopPropagation();
        props.deleteMail(mailKey);
    }

    return (
        <MailListTable>
            <Table.Head>
                <Table.TextHeaderCell>
                    Subject
                </Table.TextHeaderCell>
                <Table.TextHeaderCell>
                    From
                </Table.TextHeaderCell>
                <Table.TextHeaderCell>
                    To
                </Table.TextHeaderCell>
                <Table.TextHeaderCell></Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
                {
                    //.sort((mailA, mailB) => (mailA.parsed.date?.getTime() || new Date().getTime()) - (mailB.parsed.date?.getTime() || new Date().getTime()))
                    props.mails.sort((mailA, mailB) => {
                        return (new Date(mailB.parsed.date as any).getTime() - new Date(mailA.parsed.date as any).getTime());
                    }).map((mail) =>
                    {
                        return (
                            <Table.Row key={mail.parsed.messageId} isSelectable onSelect={() => handleSelection(mail.parsed)} isSelected={mail.parsed.messageId === selected?.messageId}>
                                <Table.TextCell>{mail.parsed.subject}</Table.TextCell>
                                <Table.TextCell>{mail.parsed.from?.value[0].name || mail.parsed.from?.value[0].address}</Table.TextCell>
                                <Table.TextCell>{mail.parsed.to?.value[0].address}</Table.TextCell>
                                <Table.TextCell ><Button onClick={(event: any) => handleDelete(event, mail.mailKey.split('/')[1])} appearance='primary' intent='danger'>Exterminer</Button></Table.TextCell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </MailListTable>
        )
    }

    export default MailList;
