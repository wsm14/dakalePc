import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Spin } from 'antd';
import { Donut } from '@/components/Charts';
import numeral from 'numeral';
import styles from '../style.less';

const rankingListData = [];

for (let i = 0; i <= 9; i += 1) {
  rankingListData.push({
    title: `a阿达${i}`,
    total: 1000,
  });
}

const MasterTotalInfo = ({ dispatch, loading, totalData }) => {
  const data = [
    {
      type: '累计商户家主',
      value: totalData.all || 0,
    },
    {
      type: '累计用户家主',
      value: totalData.all || 0,
    },
  ];

  const data2 = [
    {
      type: '商户家主收益',
      value: totalData.all || 0,
    },
    {
      type: '用户家主收益',
      value: totalData.all || 0,
    },
  ];

  const rankingData = [
    {
      title: '拥有家人排行',
      data: rankingListData,
    },
    {
      title: '拥有家店排行',
      data: rankingListData,
    },
    {
      title: '累计收益排行',
      data: rankingListData,
    },
  ];

  // 获取统计数据
  const fetchMasterTotal = (userId) => {
    dispatch({
      type: 'circleMaster/fetchMasterTotal',
      payload: { userId },
    });
  };

  useEffect(() => {
    // fetchMasterTotal()
  }, []);

  return (
    <>
      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Card bodyStyle={{ padding: 0, height: 276 }}>
            <Spin spinning={!!loading}>
              <Donut data={data} totalLabel="总家主数" height={276} />
            </Spin>
          </Card>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Card bodyStyle={{ padding: 0, height: 276 }}>
            <Spin spinning={!!loading}>
              <Donut data={data2} totalLabel="累计收益卡豆" height={276} />
            </Spin>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        {rankingData.map((data) => (
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <Card bodyStyle={{ height: 267 }} loading={loading}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>{data.title}</h4>
                <ul className={styles.rankingList}>
                  <Row gutter={50} align="middle">
                    <Col span={12}>
                      {rankingListData.slice(0, 5).map((item, i) => (
                        <li key={item.title}>
                          <span
                            className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                          >
                            {i + 1}
                          </span>
                          <span className={styles.rankingItemTitle} title={item.title}>
                            {item.title}
                          </span>
                          <span className={styles.rankingItemValue}>
                            {numeral(item.total).format('0,0')}
                          </span>
                        </li>
                      ))}
                    </Col>
                    <Col span={12}>
                      {rankingListData.slice(5).map((item, i) => (
                        <li key={item.title}>
                          <span className={styles.rankingItemNumber}>{i + 6}</span>
                          <span className={styles.rankingItemTitle} title={item.title}>
                            {item.title}
                          </span>
                          <span className={styles.rankingItemValue}>
                            {numeral(item.total).format('0,0')}
                          </span>
                        </li>
                      ))}
                    </Col>
                  </Row>
                </ul>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default connect(({ circleMaster, loading }) => ({
  totalData: circleMaster.totalData,
  loading: loading.effects['circleMaster/fetchMasterTotal'],
}))(MasterTotalInfo);
