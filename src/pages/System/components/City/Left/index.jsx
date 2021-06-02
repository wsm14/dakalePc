import React from 'react';
import { Menu } from 'antd';
import CITYJSON from '@/common/city';

const TradeAreaLeft = ({ cRef, selectCode, setSelectCode }) => {
  const routerMenu = (list) => {
    return list.map((item) => {
      return (
        <Menu.Item key={item.value} data-name={item.label}>
          {item.label}
        </Menu.Item>
      );
    });
  };

  return (
    <Menu
      inlineCollapsed={false}
      selectedKeys={[selectCode.provinceCode]}
      defaultSelectedKeys={[selectCode.provinceCode]}
      onClick={(e) => {
        const name = e.item.props['data-name'];
        setSelectCode({
          provinceName: name,
          provinceCode: e.key,
        });
        cRef.current.fetchGetData({ provinceCode: e.key });
      }}
      mode="inline"
      style={{
        width: 200,
        marginRight: 24,
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: 770,
      }}
    >
      {routerMenu(CITYJSON)}
    </Menu>
  );
};

export default TradeAreaLeft;
