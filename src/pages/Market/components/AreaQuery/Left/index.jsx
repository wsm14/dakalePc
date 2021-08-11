import React, { useState } from 'react';
import { Menu } from 'antd';
import CITYJSON from '@/common/cityJson';

const { SubMenu } = Menu;

const TradeAreaLeft = ({ cRef, selectCode, setSelectCode }) => {
  const routerMenu = (list) => {
    return list.map((item) => {
      return item.level === '1' ? (
        <SubMenu
          className={item.id === selectCode.provinceCode ? 'ant-menu-item-selected' : ''}
          onTitleClick={({ key }) => setSelectCode({ provinceCode: key })}
          key={item.id}
          title={item.name}
        >
          {routerMenu(CITYJSON.filter((i) => i.pid === item.id))}
        </SubMenu>
      ) : (
        <Menu.Item key={item.id} data-name={item.name}>
          {item.name}
        </Menu.Item>
      );
    });
  };

  return (
    <Menu
      inlineCollapsed={false}
      openKeys={[selectCode.provinceCode]}
      selectedKeys={[selectCode.cityCode || selectCode.provinceCode]}
      defaultSelectedKeys={[selectCode.provinceCode]}
      onClick={(e) => setSelectCode({ ...selectCode, cityCode: e.key })}
      mode="inline"
      style={{
        width: 200,
        marginRight: 24,
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: 770,
      }}
    >
      {routerMenu(CITYJSON.filter((i) => i.level === '1'))}
    </Menu>
  );
};

export default TradeAreaLeft;
