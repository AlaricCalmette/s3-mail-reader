import { ParsedMail } from 'mailparser';
import React, { useState } from 'react';
import { MailListTable, MailInGroupRow, GroupedMailRow, FromInGroupCell } from './styles';
import {
    Button,
    Table,
} from 'evergreen-ui';

interface OwnProps {
    mails: { parsed: ParsedMail; mailKey: string }[];
    fetchMail: (mail: ParsedMail) => void;
    deleteMail: (mailKey: string) => void;
}

const MailList = (props: OwnProps) => {
    const [selected, setSelected] = useState<ParsedMail>();
    const [groupBy, setGroupBy] = useState<string>();
    const orderedMails = props.mails.sort((mailA, mailB) => {
        return (new Date(mailB.parsed.date as any).getTime() - new Date(mailA.parsed.date as any).getTime());
    });
    let groupedMails: { [key: string]: { parsed: ParsedMail, mailKey: string }[] } | null = null;

    const handleSelection = (mail: ParsedMail) => {
        setSelected(mail);
        props.fetchMail(mail);
    }

    const handleDelete = (event: any, mailKey: string) => {
        event.stopPropagation();
        props.deleteMail(mailKey);
    }

    const assignArray = (key: string | number | symbol, value: any, collection: any) => {
        if (collection.hasOwnProperty(key)) {
            collection[key].push(value);
        }
        else {
            collection[key] = [value];
        }
        return collection;
    }

    if (groupBy) {
        groupedMails = orderedMails.reduce((acc, mail) => {
            switch (groupBy) {
                case 'from':
                    if (mail.parsed.from?.value[0].name) {
                        assignArray(mail.parsed.from?.value[0].name, mail, acc);
                    }
                    else if (mail.parsed.from?.value[0].address) {
                        assignArray(mail.parsed.from.value[0].address, mail, acc);
                    }
                    else {
                        assignArray('unknown', mail, acc);
                    }
                    break;
                case 'to':
                    if ((mail.parsed.to?.value[0].address)) {
                        assignArray(mail.parsed.to?.value[0].address, mail, acc);
                    }
                    break;
            }
            return acc;
        }, {} as { [key: string]: { parsed: ParsedMail, mailKey: string }[] });
        console.log(groupedMails);
    }

    return (
        <MailListTable>
            {groupedMails ?
                <Table.Head>
                    <Table.TextHeaderCell onClick={() => setGroupBy(undefined)}>
                        From
                    </Table.TextHeaderCell>
                    <Table.TextHeaderCell>
                        Subject
                    </Table.TextHeaderCell>
                    <Table.TextHeaderCell>
                        To
                    </Table.TextHeaderCell>
                    <Table.TextHeaderCell></Table.TextHeaderCell>
                </Table.Head>
                :
                <Table.Head>
                    <Table.TextHeaderCell>
                        Subject
                    </Table.TextHeaderCell>
                    <Table.TextHeaderCell onClick={() => setGroupBy('from')}>
                        From
                    </Table.TextHeaderCell>
                    <Table.TextHeaderCell>
                        To
                    </Table.TextHeaderCell>
                    <Table.TextHeaderCell></Table.TextHeaderCell>
                </Table.Head>
            }
            <Table.Body>
                {
                    groupedMails ?
                        Object.keys(groupedMails).map((key: string) => {
                            const mails = groupedMails![key];
                            return (
                                <GroupedMailRow key={key} isSelectable height="auto">
                                    <FromInGroupCell>{key}</FromInGroupCell>
                                    <MailInGroupRow>
                                        <Table.Body>
                                            {
                                                mails.map((mail) => {
                                                    return (
                                                        <Table.Row key={mail.mailKey} isSelectable onSelect={() => handleSelection(mail.parsed)} isSelected={mail.parsed.messageId === selected?.messageId}>
                                                            <Table.TextCell>{mail.parsed.subject}</Table.TextCell>
                                                            <Table.TextCell>{mail.parsed.to?.value[0].address}</Table.TextCell>
                                                            <Table.TextCell ><Button onClick={(event: any) => handleDelete(event, mail.mailKey.split('/')[1])} appearance='primary' intent='danger'>Exterminer</Button></Table.TextCell>
                                                        </Table.Row>
                                                    )
                                                })
                                            }
                                        </Table.Body>
                                    </MailInGroupRow>
                                </GroupedMailRow>
                            )
                        })
                        : orderedMails.map((mail) => {
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
