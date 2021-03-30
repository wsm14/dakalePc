import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import DistrictList from './DistrictList';
import CITYJSON from '@/common/city';
import styles from './style.less';

const CityListComponent = (props) => {
  const { list, loading, searchData } = props;

  const childRef = useRef();

  const { areaCode } = searchData;

  const [selectRow, setSelectRow] = useState('');

  // table 表头
  const getColumns = [
    {
      title: '排名',
      dataIndex: 'userIdString',
      render: (val, row, i) => i + 1,
    },
    {
      title: '城市名称',
      dataIndex: 'bucket',
      render: (val) => {
        const provArr = CITYJSON.filter((i) => i.value == areaCode)[0];
        const cityArr = provArr.children.filter((i) => i.value == val)[0];
        return cityArr ? cityArr.label : '--';
      },
    },
    {
      title: '营收金额',
      align: 'right',
      dataIndex: 'verificationFee',
      render: (val, record) => (record.verificationFee + record.scanOrder).toFixed(2),
      sorter: (a, b) => a.verificationFee + a.scanOrder - (b.verificationFee + b.scanOrder),
    },
    {
      title: '注册用户数',
      align: 'right',
      dataIndex: 'registerCount',
      sorter: (a, b) => a.registerCount - b.registerCount,
    },
    {
      title: '入驻店铺数',
      align: 'right',
      dataIndex: 'settleCount',
      sorter: (a, b) => a.settleCount - b.settleCount,
    },
    {
      title: '激活店铺数',
      align: 'right',
      dataIndex: 'activeCount',
      sorter: (a, b) => a.activeCount - b.activeCount,
    },
  ];

  useEffect(() => {
    setSelectRow('');
    childRef.current.fetchGetData(searchData);
  }, [searchData]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        {selectRow && '各城市排行'}
        <TableDataBlock
          firstFetch={false}
          noCard={false}
          cRef={childRef}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.bucket}`}
          params={{ bucket: 'cityCode' }}
          dispatchType="areaTotal/fetchGetList"
          list={list}
          rowClassName={(record) => (record.bucket == selectRow ? styles.waitList_rowColor : '')}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectRow(record.bucket);
              }, // 点击行
            };
          }}
        ></TableDataBlock>
      </div>
      {selectRow && (
        <div style={{ flex: 1, marginLeft: 5 }}>
          各区县排行
          <DistrictList searchData={searchData} cityCode={selectRow}></DistrictList>
        </div>
      )}
    </div>
  );
};

export default connect(({ areaTotal, loading }) => ({
  list: areaTotal.list,
  loading: loading.effects['areaTotal/fetchGetList'],
}))(CityListComponent);
