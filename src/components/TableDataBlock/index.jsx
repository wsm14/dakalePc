import React from 'react';
import { useLocation, useSelector } from 'umi';
import { KeepAlive } from 'react-activation';
import TableBlock from './tableBlock';

/**
 * 判断是否保持数据
 */

const TableDataBlockComponent = (props) => {
  const menuNameObj = useSelector((state) => state.userInfo.menuNameObj);
  const { keepName = false } = props;
  const match = useLocation();

  const KeepContent = {
    true: (
      <KeepAlive
        name={menuNameObj[match.pathname]}
        url={match.pathname}
        saveScrollPosition="screen"
      >
        <TableBlock {...props}></TableBlock>
      </KeepAlive>
    ),
    false: <TableBlock {...props}></TableBlock>,
  }[keepName];

  return KeepContent;
};

export default TableDataBlockComponent;
