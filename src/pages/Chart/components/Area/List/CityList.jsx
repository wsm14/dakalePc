import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import DataTableBlock from '@/components/DataTableBlock';
import DistrictList from './DistrictList';
import styles from './style.less';

const CityListComponent = (props) => {
  const { list, loading, dispatch, searchData } = props;

  const childRef = useRef();

  const [selectRow, setSelectRow] = useState('');

  // table 表头
  const getColumns = [
    {
      title: '排名',
      fixed: 'left',
      dataIndex: 'userIdString',
    },
    {
      title: '城市名称',
      fixed: 'left',
      dataIndex: 'mobile',
    },
    {
      title: '营收金额',
      align: 'right',
      dataIndex: 'username',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '注册用户数',
      align: 'right',
      dataIndex: 'residentAddress',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '入驻店铺数',
      align: 'right',
      dataIndex: 'createTime',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '激活店铺数',
      align: 'right',
      dataIndex: 'status',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
  ];

  useEffect(() => {
    childRef.current.fetchGetData(searchData);
  }, [searchData]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        {selectRow && '各城市排行'}
        <DataTableBlock
          NoSearch
          CardNone={false}
          cRef={childRef}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.companyId}`}
          dispatchType="provCompany/fetchGetList"
          list={list.list}
          rowClassName={(record) => (record.companyId == selectRow ? styles.waitList_rowColor : '')}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectRow(record.companyId);
              }, // 点击行
            };
          }}
        ></DataTableBlock>
      </div>
      {selectRow && (
        <div style={{ flex: 1, marginLeft: 5 }}>
          各区县排行
          <DistrictList></DistrictList>
        </div>
      )}
    </div>
  );
};

export default connect(({ provCompany, loading }) => ({
  list: provCompany.list,
  loading: loading.effects['provCompany/fetchGetList'],
}))(CityListComponent);
