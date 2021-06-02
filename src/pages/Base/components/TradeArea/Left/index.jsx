import React, { useState } from 'react';
import { Menu, Select } from 'antd';
import CITYJSON from '@/common/city';

const { SubMenu } = Menu;

const TradeAreaLeft = ({ cRef, selectCode, setSelectCode }) => {
  const [pId, setPIdIds] = useState('33'); // menu 选择的省key
  const [cityCode, setCityCode] = useState('3301'); // menu 展开的城市key
  const [dCode, setDCode] = useState('3301'); // menu 选择的城市key 高亮

  const routerMenu = (list, val) => {
    return list.map((item) => {
      return item[val] ? (
        <SubMenu
          className={item.value === dCode ? 'ant-menu-item-selected' : ''}
          onTitleClick={({ key }) => {
            setCityCode(key);
            setDCode(key);
            setSelectCode({ ...selectCode, cityName: item.label, cityCode: key, districtCode: '' });
            cRef.current.fetchGetData({ cityCode: key });
          }}
          key={item.value}
          title={item.label}
        >
          {routerMenu(item[val], 'children')}
        </SubMenu>
      ) : (
        <Menu.Item key={item.value} data-name={item.label}>
          {item.label}
        </Menu.Item>
      );
    });
  };

  return (
    <div>
      <Select
        showSearch
        value={pId}
        style={{ width: 200 }}
        optionFilterProp="label"
        options={CITYJSON}
        filterOption={true}
        onChange={(val, item) => {
          setPIdIds(val);
          setCityCode(item.children.length == 1 ? item.children[0].value : '');
          setSelectCode({
            provinceCode: val,
            provinceName: item.label,
            cityCode: '',
            districtCode: '',
          });
        }}
      ></Select>
      <Menu
        openKeys={[cityCode]}
        inlineCollapsed={false}
        selectedKeys={[dCode]}
        defaultSelectedKeys={['3301']}
        onClick={({ key, domEvent }) => {
          setDCode(key);
          const name = domEvent.target.dataset.name;
          setSelectCode({
            ...selectCode,
            districtName: name,
            districtCode: key,
          });
          cRef.current.fetchGetData({ cityCode, districtCode: key });
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
        {routerMenu(CITYJSON.filter((i) => i.value == pId)[0].children, 'children')}
      </Menu>
    </div>
  );
};

export default TradeAreaLeft;
