import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Card, Button, Switch } from 'antd';
import { CITY_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import ManageCityLeft from './components/City/Left';
import manageCitySet from './components/City/ManageCitySet';

const ManageCity = (props) => {
  const { loading, manageCity, dispatch } = props;

  const childRef = useRef();
  const [selectCode, setSelectCode] = useState({
    provinceCode: '33',
    provinceName: '浙江',
  });

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
              type: 'edit',
              visible: !!row.provinceCode,
              click: () => handleManageCitySet({ ...row, id: val }),
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

  // 城市新增修改
  const handleManageCitySet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: manageCitySet({ dispatch, childRef, initialValues }),
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

  return (
    <Card bordered={false} bodyStyle={{ display: 'flex' }}>
      <ManageCityLeft
        cRef={childRef}
        selectCode={selectCode}
        setSelectCode={setSelectCode}
      ></ManageCityLeft>
      <div style={{ flex: 1 }}>
        <DataTableBlock
          btnExtra={
            <AuthConsumer auth="save">
              <Button
                className="dkl_green_btn"
                disabled={!selectCode.provinceCode}
                onClick={() => handleManageCitySet(selectCode)}
              >
                新增
              </Button>
            </AuthConsumer>
          }
          noCard={false}
          cRef={childRef}
          loading={loading.models.manageCity}
          columns={getColumns}
          rowKey={(record) => `${record.locationCityIdString}`}
          pagination={false}
          params={{ provinceCode: selectCode.provinceCode }}
          dispatchType="manageCity/fetchGetList"
          {...manageCity}
        ></DataTableBlock>
      </div>
    </Card>
  );
};

export default connect(({ manageCity, loading }) => ({
  manageCity,
  loading,
}))(ManageCity);
