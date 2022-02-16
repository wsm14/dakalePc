import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Statistic, Card, Row, Col, Spin } from 'antd';
import styles from '../style.less';

const UserTotalInfo = ({ dispatch, loading, totalData, matchType }) => {

  const matchInfo = {
    step: {
      color: 'rgb(245, 154, 35)',
      info: (
        <>
          <Col span={8}>
            <Statistic title="人均报名卡豆数" value={totalData.averageSignBeanAmount}></Statistic>
          </Col>
          <Col span={8}>
            <Statistic title="人均获得卡豆数" value={totalData.averageBeanAmount}></Statistic>
          </Col>
          <Col span={8}>
            <Statistic title="人均步数" value={totalData.averageStepNumber}></Statistic>
          </Col>
        </>
      ),
    },
    wakeUp: {
      color: '',
      info: (
        <>
          <Col span={8}>
            <Statistic title="平均报名卡豆数" value={totalData.averageSignBeanAmount}></Statistic>
          </Col>
          <Col span={8}>
            <Statistic title="平均获得卡豆数" value={totalData.averageBeanAmount}></Statistic>
          </Col>
        </>
      ),
    },
  }[matchType];

  // 获取用户详情
  const fetchMarketRMTotal = () => {
    dispatch({
      type: 'marketCardRMing/fetchMarketRMTotal',
      payload: { subIdentify: matchType },
    });
  };

  useEffect(() => {
    fetchMarketRMTotal();
  }, []);

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card bordered={false} bodyStyle={{ marginBottom: 16, padding: 10, height: 186 }}>
          <Spin spinning={!!loading}>
            <div className={styles.mrm_totle} style={{ backgroundColor: matchInfo.color }}>
              <Statistic title="总期数" value={totalData.total}></Statistic>
            </div>
          </Spin>
        </Card>
      </Col>
      <Col span={18}>
        <Card bordered={false} loading={loading} bodyStyle={{ paddingBottom: 0, height: 186 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Statistic title="累计报名人数" value={totalData.signAmount}></Statistic>
            </Col>
            <Col span={8}>
              <Statistic title="累计报名卡豆数" value={totalData.totalBean}></Statistic>
            </Col>
            <Col span={8}>
              <Statistic title="累计完成目标人数" value={totalData.targetUserAmount}></Statistic>
            </Col>
            {matchInfo.info}
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default connect(({ marketCardRMing, loading }) => ({
  totalData: marketCardRMing.totalData,
  loading: loading.effects['marketCardRMing/fetchMarketRMTotal'],
}))(UserTotalInfo);
