import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { CITY_STATUS } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import AreaQueryLeft from './components/AreaQuery/Left';
import ManageCitySet from './components/AreaQuery/ManageCitySet';

const AreaQuery = (props) => {
  const { loading, manageCity, dispatch } = props;

  const childRef = useRef();
  const [selectCode, setSelectCode] = useState({
    provinceCode: '33',
    provinceName: '浙江省',
  });

  const [visibleSet, setVisibleSet] = useState(false);

  // table 表头
  const getColumns = [
    {
      title: '市',
      dataIndex: 'cityName',
    },
    {
      title: '背景图',
      dataIndex: 'backgroundImg',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '城市文案',
      dataIndex: 'cityDesc',
    },
    {
      title: '状态',
      type: 'switch',
      dataIndex: 'status',
      render: (val, row) => {
        const { locationCityIdString: id } = row;
        return {
          auth: 'status',
          checkedChildren: '已开通',
          unCheckedChildren: '未开通',
          show: !!val,
          noAuth: CITY_STATUS[val],
          checked: val === '1',
          onClick: () => fetchCityManageStatus({ id, status: 1 ^ Number(val) }),
        };
      },
    },
    {
      type: 'handle',
      dataIndex: 'locationCityIdString',
      render: (val, row) => [
        {
          type: 'edit',
          visible: !!row.provinceCode,
          click: () => handleManageCitySet('edit', { ...row, id: val }),
        },
        {
          type: 'del',
          visible: !!row.provinceCode,
          click: () => fetchCityManageStatus({ id: val, deleteFlag: 0 }),
        },
      ],
    },
  ];

  // 城市新增修改
  const handleManageCitySet = (type, initialValues) => {
    setVisibleSet({
      show: true,
      type,
      initialValues,
    });
  };

  // 城市状态修改
  const fetchCityManageStatus = (payload) => {
    dispatch({
      type: 'manageCity/fetchCityManageStatus',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  const extraBtn = [
    {
      auth: 'save',
      disabled: !selectCode.provinceCode,
      onClick: () => handleManageCitySet('add', selectCode),
    },
  ];

  return (
    <Card bordered={false} bodyStyle={{ display: 'flex' }}>
      <AreaQueryLeft
        cRef={childRef}
        selectCode={selectCode}
        setSelectCode={setSelectCode}
      ></AreaQueryLeft>
      <div style={{ flex: 1 }}>
        <TableDataBlock
          noCard={false}
          btnExtra={extraBtn}
          cRef={childRef}
          loading={loading.models.manageCity}
          columns={getColumns}
          rowKey={(record) => `${record.locationCityIdString}`}
          pagination={false}
          params={{ provinceCode: selectCode.provinceCode }}
          dispatchType="manageCity/fetchGetList"
          {...manageCity}
        ></TableDataBlock>
      </div>
      <ManageCitySet
        visible={visibleSet}
        childRef={childRef}
        onClose={() => setVisibleSet(false)}
      ></ManageCitySet>
    </Card>
  );
};

export default connect(({ manageCity, loading }) => ({
  manageCity,
  loading,
}))(AreaQuery);
