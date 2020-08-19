import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Statistic, Card, Row, Col, Spin } from 'antd';
import styles from './style.less';

const UserTotalInfo = ({ dispatch, loading, totalData, matchType }) => {
  const data = [
    {
      type: '实名用户',
      value: totalData.all || 0,
    },
    {
      type: '充值用户',
      value: totalData.all || 0,
    },
  ];

  const matchInfo = {
    step: {
      color: 'rgb(245, 154, 35)',
      info: (
        <>
          <Col span={8}>
            <Statistic title="人均报名卡豆数" value={totalData.all}></Statistic>
          </Col>
          <Col span={8}>
            <Statistic title="人均获得卡豆数" value={totalData.all}></Statistic>
          </Col>
          <Col span={8}>
            <Statistic title="人均步数" value={totalData.all}></Statistic>
          </Col>
        </>
      ),
    },
    wakeUp: {
      color: '',
      info: (
        <>
          <Col span={8}>
            <Statistic title="平均报名卡豆数" value={totalData.all}></Statistic>
          </Col>
          <Col span={8}>
            <Statistic title="平均获得卡豆数" value={totalData.all}></Statistic>
          </Col>
        </>
      ),
    },
  }[matchType];

  // 获取用户详情
  const fetchUserDetail = (val) => {
    console.log(val);
    // dispatch({
    //   type: 'userList/fetchUserTotal',
    //   payload: { userId },
    //   callback: handleShowUserDetail,
    // });
  };

  useEffect(() => {}, []);

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card bordered={false} bodyStyle={{ marginBottom: 16, padding: 10, height: 186 }}>
          <Spin spinning={!!loading}>
            <div className={styles.mrm_totle} style={{ backgroundColor: matchInfo.color }}>
              <Statistic title="总期数" value={totalData.all}></Statistic>
            </div>
          </Spin>
        </Card>
      </Col>
      <Col span={18}>
        <Card bordered={false} loading={loading} bodyStyle={{ paddingBottom: 0, height: 186 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Statistic title="累计报名人数" value={totalData.all}></Statistic>
            </Col>
            <Col span={8}>
              <Statistic title="累计报名卡豆数" value={totalData.all}></Statistic>
            </Col>
            <Col span={8}>
              <Statistic title="累计完成目标人数" value={totalData.all}></Statistic>
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
  loading: loading.effects['marketCardRMing/fetchUserTotal'],
}))(UserTotalInfo);
