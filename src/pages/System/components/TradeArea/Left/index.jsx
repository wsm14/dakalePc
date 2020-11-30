import React, { useState } from 'react';
import { Menu, Select } from 'antd';
import CITYJSON from '@/common/city';

const { SubMenu } = Menu;

const TradeAreaLeft = ({ cRef, selectCode, setSelectCode }) => {
  const [pId, setPIdIds] = useState('33');
  const [cityCode, setCityCode] = useState('3301');
  const [dCode, setDCode] = useState('');

  const routerMenu = (list, val) => {
    return list.map((item, index) => {
      return item[val] ? (
        <SubMenu
          onTitleClick={({ key }) => {
            setCityCode(key);
            setDCode('');
            setSelectCode({ ...selectCode, cityName: item.label, cityCode: key, districtCode: '' });
            cRef.current.fetchGetData({ cityCode: key });
          }}
          key={item.value}
          title={item.label}
        >
          {routerMenu(item[val], 'children')}
        </SubMenu>
      ) : (
        <Menu.Item key={item.value}>{item.label}</Menu.Item>
      );
    });
  };
  const filterOpenKeys = (list, val) => {
    let arr = [];
    const lists = list.filter((item) => {
      if (item[val]) {
        let a = filterOpenKeys(item[val], val);
        arr.push(...a);
        return true;
      }
    });
    return [...lists, ...arr];
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
        onClick={(e) => {
          setDCode(e.key);
          const name = e.item.props.children;
          setSelectCode({
            ...selectCode,
            districtName: name[name.length - 1],
            districtCode: e.key,
          });
          cRef.current.fetchGetData({ cityCode, districtCode: e.key });
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
