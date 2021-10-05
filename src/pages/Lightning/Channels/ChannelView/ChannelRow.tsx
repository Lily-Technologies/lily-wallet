import React from "react";
import styled from "styled-components";

import { TableRow, TableColumn } from "src/components/Table";
import { Badge } from "src/components";

import {
  gray50,
  gray500,
  gray900,
  green100,
  green800,
  red100,
  red800,
  yellow100,
  yellow800
} from "src/utils/colors";

interface Props {
  alias: string;
  capacity: number;
  status: 'active' | 'inactive' | 'pending';
  onClick: () => void;
}

const ChannelRow = ({ alias, capacity, status, onClick }: Props) => (
  <TableRowNoBorder onClick={() => onClick()}>
    <TableColumnNoPadding>
      <ChannelHeader>{alias}</ChannelHeader>
      <ChannelSubheader>
        Capacity: {capacity.toLocaleString()} sats
      </ChannelSubheader>
    </TableColumnNoPadding>
    <RightAlignColumn>
      <Badge
        background={status === 'active' ? green100 : status === 'inactive' ? red100 : yellow100}
        color={status === 'active' ? green800 : status === 'inactive' ? red800 : yellow800}
        style={{ marginRight: "1em" }}
      >
        {status === 'active' ? 'online' : status === 'inactive' ? 'offline' : 'pending'}
      </Badge>
    </RightAlignColumn>
  </TableRowNoBorder>
);

const TableColumnNoPadding = styled(TableColumn)`
  padding-left: 0;
  padding-right: 0;
`;

const TableRowNoBorder = styled(TableRow)`
  border-left: none;
  border-right: none;
  border-top: none;

  &:hover {
    background: ${gray50};
    cursor: pointer;
  }
`;

const RightAlignColumn = styled(TableColumn)`
  text-align: right;
  color: ${green800};
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  padding-left: 0;
  padding-right: 0;
`;

const ChannelHeader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray900};
  font-weight: 500;
`;

const ChannelSubheader = styled.div`
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${gray500};
  font-weight: 500;
`;

export default ChannelRow;
