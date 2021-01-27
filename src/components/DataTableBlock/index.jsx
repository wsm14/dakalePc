import React from 'react';
import { useLocation } from 'umi';
import { KeepAlive } from 'react-activation';
import TableBlock from './tableBlock';

/**
 * 判断是否保持数据
 */

const DataTableBlockComponent = (props) => {
  const { keepName } = props;
  const match = useLocation();
  
  const KeepContent = {
    true: (
      <KeepAlive name={keepName} url={match.pathname} saveScrollPosition="screen">
        <TableBlock {...props}></TableBlock>
      </KeepAlive>
    ),
    false: <TableBlock {...props}></TableBlock>,
  }[!!keepName];

  return KeepContent;
};

export default DataTableBlockComponent;
