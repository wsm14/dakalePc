import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin, Cascader } from 'antd';
import moment from 'moment';
import CITY from '@/common/city';
import { Column, Line } from '@/components/Charts';
import { ORDER_GOODS_TYPES, AREA_ORDER_GOODS_TYPES } from '@/common/constant';
import SearchBlock from '../SearchBlock';
import old from '@/pages/System/components/Walking/GratiaClass/components/old';

const TrendAnalyse = (props) => {
  const { dispatch, loading, newRegisterDataObj } = props;
  const [data, setData] = useState({
    groupType: 'day',
    dataTypes: 'scan,special,coupon',
    subStatisticType: 'payMoney',
    statisticType: 'orderTrendAnalysis',
    startStatisticDay: moment().subtract(7, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  });
  const [city, setCity] = useState([]);

  // 监听数据变化发送请求
  useEffect(() => {
    data && fetchSearch();
  }, [data]);

  // 请求接口
  const fetchSearch = () => {
    dispatch({
      type: 'orderDataStat/fetchOrderTrendAnalysisReport',
      payload: data,
    });
  };

  return (
    <div>
      <SearchBlock
        data={data}
        setData={setData}
        btnObj={{
          payMoney: '支付金额',
          verificationMoney: '核销金额',
          orderAmount: '支付订单数',
        }}
        btnObjKeyName="subStatisticType"
        portTypeList={city.length === 0 ? ORDER_GOODS_TYPES : AREA_ORDER_GOODS_TYPES}
        defaultPortType={['scan', 'special', 'coupon']}
        appTypeName="dataTypes"
        allText={
          <div>
            <div style={{ display: 'inline-block', marginRight: 60 }}>
              <Cascader
                value={city}
                options={CITY.map((item) => ({
                  ...item,
                  children: item.children.map((citem) => ({ ...citem, children: undefined })),
                }))}
                onChange={(val) => {
                  let obj = {};
                  const booleanArr = data.dataTypes
                    .split(',')
                    .filter((item) =>
                      ['channel', 'virtual', 'commerce', 'community', 'weekly', 'gift'].includes(
                        item,
                      ),
                    );
                  if (val && booleanArr.length !== 0) {
                    obj = { dataTypes: 'scan,special,coupon' };
                  }
                  setCity(val || []);
                  setData((old) => ({ ...old, cityCode: (val && val[1]) || undefined, ...obj }));
                }}
                placeholder="请选择地区"
              />
            </div>
            {`累计：${newRegisterDataObj.total || '-'}    均值：${
              newRegisterDataObj.average || '-'
            }`}
          </div>
        }
      ></SearchBlock>
      {/* 图表 */}
      <Spin spinning={loading}>
        <Column
          data={
            newRegisterDataObj.dataList.filter((item) =>
              data.dataTypes.split(',').includes(item.types),
            ) || []
          }
          xyField={{ xField: 'analysisDay', yField: 'value' }}
          legend={false}
          seriesField="type"
          isStack={true}
          label={{
            position: 'middle',
          }}
          maxColumnWidth={40}
        />
      </Spin>
    </div>
  );
};

export default connect(({ orderDataStat, loading }) => ({
  newRegisterDataObj: orderDataStat.newRegisterDataObj,
  loading: loading.effects['orderDataStat/fetchOrderTrendAnalysisReport'],
}))(TrendAnalyse);
