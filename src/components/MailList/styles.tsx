import styled from 'styled-components';
import { Table } from 'evergreen-ui';

export const MailListTable = styled(Table)`
    width: 50vw;
`;

export const GroupedMailRow = styled(Table.Row)`
    display: flex;
`;

export const MailInGroupRow = styled(Table.Cell)`
    flex: 3;
`;

export const FromInGroupCell = styled(Table.TextCell)`
    flex: 1;
`;