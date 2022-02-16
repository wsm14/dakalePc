import React from 'react';
import { Menu } from 'antd';
import CITYJSON from '@/common/cityJson';

const { SubMenu } = Menu;

const TradeAreaLeft = ({ fetchGetInfo, selectCode, setSelectCode }) => {
  const routerMenu = (list) => {
    return list.map((item) => {
      return item.level === '1' ? (
        <SubMenu
          className={item.id === selectCode.provinceCode ? 'ant-menu-item-selected' : ''}
          onTitleClick={({ key }) => {
            fetchGetInfo({ pid: key });
            setSelectCode({ provinceCode: key });
          }}
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
    <>
      <Menu
        inlineCollapsed={false}
        openKeys={[selectCode.provinceCode]}
        selectedKeys={[selectCode.cityCode || selectCode.provinceCode]}
        defaultSelectedKeys={[selectCode.provinceCode]}
        onClick={(e) => {
          fetchGetInfo({ pid: e.key });
          setSelectCode({ ...selectCode, cityCode: e.key });
        }}
        mode="inline"
        style={{
          width: 130,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'absolute',
          left: 0,
          overflowY: 'auto',
          height: `calc(100vh - 48px)`,
        }}
      >
        {routerMenu(CITYJSON.filter((i) => i.level === '1'))}
      </Menu>
      <div style={{ width: 130 }}></div>
    </>
  );
};

export default TradeAreaLeft;
