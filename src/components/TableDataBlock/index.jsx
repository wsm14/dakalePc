import React from 'react';
import { useLocation, useSelector } from 'umi';
import { KeepAlive } from 'react-activation';
import TableBlock from './tableBlock';

/**
 * 表格组件父组件
 * 判断是否启用 KeepAlive 组件
 * @param keepData 启用组件 默认false 顶部tab显示
 */

const TableDataBlockComponent = (props) => {
  const { keepData = false } = props;
  // 获取线上菜单储存的路由对象
  const menuNameObj = useSelector((state) => state.userInfo.menuNameObj);
  // 路由信息
  const match = useLocation().pathname;
  // 表格
  const content = <TableBlock {...props}></TableBlock>;
  // 显示内容
  const KeepContent = {
    true: (
      <KeepAlive name={menuNameObj[match]} url={match} saveScrollPosition="screen">
        {content}
      </KeepAlive>
    ),
    false: content,
  }[keepData];

  return KeepContent;
};

export default TableDataBlockComponent;
