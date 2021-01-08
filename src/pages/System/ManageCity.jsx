import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Switch } from 'antd';
import CITYJSON from '@/common/city';
import { CITY_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const ManageCity = (props) => {
  const { loading, dispatch } = props;

  const childRef = useRef();
  const [provinceList] = useState(
    Object.assign([], CITYJSON).map((i) => ({
      cityName: i.label,
      locationCityIdString: i.value,
      children: [],
    })),
  );

  // table 表头
  const getColumns = [
    {
      title: '省/市',
      align: 'center',
      dataIndex: 'cityName',
    },
    {
      title: '背景图',
      align: 'center',
      dataIndex: 'backgroundImg',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '城市文案',
      dataIndex: 'cityDesc',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) =>
        val && (
          <AuthConsumer auth="status" noAuth={CITY_STATUS[val]}>
            <Switch
              checked={val === '1'}
              checkedChildren="已开通"
              unCheckedChildren="未开通"
              onClick={() =>
                fetchCityManageStatus({
                  id: row.locationCityIdString,
                  status: 1 ^ Number(val),
                })
              }
            />
          </AuthConsumer>
        ),
    },
    {
      title: '操作',
      dataIndex: 'locationCityIdString',
      align: 'right',
      render: (val, row) => (
        <HandleSetTable
          formItems={[
            {
              type: 'save',
              visible: !row.provinceCode,
              click: () =>
                handleSysMenuSet({
                  menuName: row.accessName,
                }),
            },
            {
              type: 'edit',
              visible: !!row.provinceCode,
              click: () => fetchGetMenuDetail({ accessId: val }),
            },
            {
              type: 'del',
              visible: !!row.provinceCode,
              click: () => fetchCityManageStatus({ id: val, deleteFlag: 0 }),
            },
          ]}
        />
      ),
    },
  ];

  // 城市状态修改
  const fetchCityManageStatus = (payload) => {
    dispatch({
      type: 'manageCity/fetchCityManageStatus',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 获取城市列表
  const fetchGetCityList = (provinceCode, row) => {
    dispatch({
      type: 'manageCity/fetchGetList',
      payload: { provinceCode, row },
    });
  };

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading.models.manageCity}
      columns={getColumns}
      rowKey={(record) => `${record.locationCityIdString}`}
      pagination={false}
      onExpand={(expanded, row) => expanded && fetchGetCityList(row.locationCityIdString, row)}
      list={provinceList}
    ></DataTableBlock>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(ManageCity);
