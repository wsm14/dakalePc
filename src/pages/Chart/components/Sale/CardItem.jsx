import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Card, Statistic, Col, Row } from 'antd';
import QuestionTooltip from '@/components/QuestionTooltip';
import Search from './Search/SearchCard';

const SaleBlockComponent = ({
  title,
  tip,
  saleTotal,
  keyName,
  keyOther,
  loading,
  dispatch,
  api,
  timeSearch = true,
}) => {
  // 时间参数
  const [timeData, setTimeData] = useState([moment(), moment()]);

  useEffect(() => {
    api && fetchGetTotalData();
  }, [timeData]);

  // 获取数据
  const fetchGetTotalData = () => {
    dispatch({
      type: api,
      payload: {
        dataType: keyName,
        beginDate: timeData[0].format('YYYY-MM-DD'),
        endDate: timeData[1].format('YYYY-MM-DD'),
      },
    });
  };

  return (
    <Col span={6}>
      <Card>
        <QuestionTooltip type="quest" title={title} content={tip}></QuestionTooltip>
        {timeSearch && <Search timeData={timeData} setTimeData={setTimeData}></Search>}
        {keyOther ? (
          <Row>
            {keyOther.map((item) => (
              <Col span={12} key={item.key}>
                <Statistic
                  title={item.title}
                  value={
                    saleTotal[item.key] > 999999
                      ? saleTotal[item.key] / 1000
                      : saleTotal[item.key] || 0
                  }
                  precision={0}
                  suffix={saleTotal[item.key] > 999999 ? 'w' : null}
                  loading={loading.effects[api]}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Statistic
            value={saleTotal[keyName] || 0}
            precision={0}
            loading={loading.effects[api]}
            valueStyle={{ fontSize: 40, color: '#1890ff', marginTop: timeSearch ? 0 : 32 }}
          />
        )}
      </Card>
    </Col>
  );
};

export default connect(({ saleTotal, loading }) => ({
  saleTotal: saleTotal,
  loading,
}))(SaleBlockComponent);
