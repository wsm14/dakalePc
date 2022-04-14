import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin, Cascader, Progress, Tooltip, Row, Col } from 'antd';
import moment from 'moment';
import CITY from '@/common/city';
import { Column, Line } from '@/components/Charts';
import { ORDER_GOODS_TYPES } from '@/common/constant';
import SearchBlock from '../SearchBlock';

const BeanCounteractInfo = (props) => {
  const { dispatch, loading, pieList } = props;

  const [data, setData] = useState({
    statisticType: 'orderBeanAnalysis',
    subStatisticType: 'beanReduce',
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
      type: 'orderDataStat/fetchOrderBeanAnalysisReport',
      payload: data,
    });
  };

  return (
    <div style={{ paddingTop: 25 }}>
      <SearchBlock
        data={data}
        setData={setData}
        timeDayMonthOk={false}
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
                  setCity(val || []);
                  setData((old) => ({ ...old, cityCode: (val && val[1]) || undefined }));
                }}
                placeholder="请选择地区"
              />
            </div>
            {`累计卡豆抵扣金额：${pieList.allBeanMoney || '-'}    总抵扣比例：${
              pieList.allBeanMoneyRatio || '-'
            }`}
          </div>
        }
      ></SearchBlock>
      {/* 图表 */}
      <Spin spinning={loading}>
        <Row>
          {pieList.list.map((item) => (
            <Col key={item.type} flex="20%" style={{ textAlign: 'center' }}>
              <Tooltip
                title={
                  <div>
                    <div>{`抵扣比例：${item.value}%`}</div>
                    <div>{`抵扣金额：${item.beanMoney}`}</div>
                  </div>
                }
              >
                <Progress
                  strokeWidth={6}
                  style={{ marginTop: 45 }}
                  type="circle"
                  percent={item.value}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  format={() => (
                    <div>
                      <div>{`${item.value}%`}</div>
                    </div>
                  )}
                />
              </Tooltip>
              <div style={{ marginTop: 10, fontSize: 16 }}>{item.type}</div>
            </Col>
          ))}
        </Row>
      </Spin>
    </div>
  );
};

export default connect(({ orderDataStat, loading }) => ({
  pieList: orderDataStat.pieList,
  loading: loading.effects['orderDataStat/fetchOrderBeanAnalysisReport'],
}))(BeanCounteractInfo);
