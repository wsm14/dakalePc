import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import { Pie } from '@/components/Charts';
import moment from 'moment';
import { ORDER_AREA_TYPES } from '@/common/constant';
import SearchBlock from '../SearchBlock';
import TableDataBlock from '@/components/TableDataBlock';
import CITYJSON from '@/common/city';
import DistrictList from './DistrictList';
import styles from './style.less';

const AreaPercentage = ({ areaData, dispatch, loading }) => {
  const childRef = useRef();

  console.log('areaData', areaData);

  const [data, setData] = useState({
    groupBy: 'city',
    subStatisticType: 'scan,specialGoods',
    statisticType: 'orderAreaAnalysis',
    startStatisticDay: moment().subtract(7, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  });
  const [selectRow, setSelectRow] = useState('');

  // 监听数据变化发送请求
  useEffect(() => {
    setSelectRow(areaData.cityList[0]?.cityCode);
    dispatch({
      type: 'orderDataStat/fetchOrderAreaAnalysisReport',
      payload: data,
    });
  }, [data]);

  // table 表头
  const getColumns = [
    {
      title: '城市',
      dataIndex: 'type',
    },
    {
      title: '支付金额占比',
      dataIndex: 'moneyPercent',
    },
    {
      title: '支付金额',
      dataIndex: 'payMoneySum',
      render: (val) => `￥${val}`,
    },
  ];

  return (
    <div style={{ marginTop: 25 }}>
      <SearchBlock
        data={data}
        setData={setData}
        portTypeList={ORDER_AREA_TYPES}
        defaultPortType={['scan', 'specialGoods']}
        appTypeName="subStatisticType"
        timeDayMonthOk={false}
      ></SearchBlock>
      {/* 图表 */}
      <div style={{ display: 'flex', marginTop: 25 }}>
        <div style={{ maxWidth: '40%', marginTop: 25 }}>
          <Spin spinning={loading}>
            <Pie
              data={areaData.cityList}
              angleField="payMoneySum"
              title="支付金额"
              innerRadius={0.6}
              legend={false}
            />
          </Spin>
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
          <div style={{ flex: 1 }}>
            <TableDataBlock
              pagination={false}
              firstFetch={false}
              noCard={false}
              cRef={childRef}
              loading={loading}
              columns={getColumns}
              rowKey={(record) => `${record.cityCode}`}
              dispatchType="orderDataStat/fetchOrderAreaAnalysisReport"
              list={areaData.cityList}
              rowClassName={(record) =>
                record.cityCode == selectRow ? styles.waitList_rowColor : ''
              }
              onRow={(record) => {
                return {
                  onClick: () => {
                    setSelectRow(record.cityCode);
                  }, // 点击行
                };
              }}
            ></TableDataBlock>
          </div>
          {selectRow && (
            <div style={{ flex: 1, marginLeft: 5 }}>
              <DistrictList searchData={data} cityCode={selectRow}></DistrictList>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default connect(({ orderDataStat, loading }) => ({
  areaData: orderDataStat.areaData,
  loading: loading.effects['orderDataStat/fetchOrderAreaAnalysisReport'],
}))(AreaPercentage);
