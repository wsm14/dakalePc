import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Card, Row, Col, Spin, Tooltip } from 'antd';
import { Pie } from '@/components/Charts';
import numeral from 'numeral';
import styles from './style.less';

const MasterTotalInfo = ({
  dispatch,
  loading,
  loading2,
  masterTotal,
  incomeTotal,
  totalListData,
}) => {
  // 获取统计数据
  const fetchMasterTotal = () => {
    dispatch({
      type: 'circleMaster/fetchMasterTotal',
    });
  };

  // 获取统计数据
  const fetchMasterTotalList = () => {
    dispatch({
      type: 'circleMaster/fetchMasterTotalList',
    });
  };

  useEffect(() => {
    fetchMasterTotal();
    fetchMasterTotalList();
  }, []);

  const stylesCard = { padding: 10 };

  return (
    <>
      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Spin spinning={!!loading}>
            <Card bordered={false} bodyStyle={stylesCard}>
              <div style={{ height: 276 }}>
                <Pie
                  data={masterTotal}
                  title="总家主数"
                  angleField="content"
                  colorField="statisticDesc"
                  innerRadius={0.6}
                />
              </div>
            </Card>
          </Spin>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Spin spinning={!!loading}>
            <Card bordered={false} bodyStyle={stylesCard}>
              <div style={{ height: 276 }}>
                <Pie
                  data={incomeTotal}
                  title="累计收益卡豆"
                  innerRadius={0.6}
                  angleField="content"
                  colorField="statisticDesc"
                />
              </div>
            </Card>
          </Spin>
        </Col>
      </Row>
      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        {totalListData.map((data) => (
          <Col key={data.type} xl={8} lg={12} md={12} sm={24} xs={24}>
            <Card bodyStyle={{ height: 267 }} loading={loading2}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                  {
                    {
                      childUserCount: '拥有家人排行',
                      childMerchantCount: '拥有家店排行',
                      familyEarnRank: '累计收益排行',
                    }[data.type]
                  }
                </h4>
                <ul className={styles.rankingList}>
                  <Row gutter={25} align="middle">
                    <Col span={12}>
                      {data.rankList.slice(0, 5).map((item, i) => (
                        <li key={item.name}>
                          <span
                            className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                          >
                            {i + 1}
                          </span>
                          <Tooltip title={item.name}>
                            <span className={styles.rankingItemTitle}>{item.name}</span>
                          </Tooltip>
                          <span className={styles.rankingItemValue}>
                            {numeral(item.total).format('0,0')}
                          </span>
                        </li>
                      ))}
                    </Col>
                    <Col span={12}>
                      {data.rankList.slice(5, 10).map((item, i) => (
                        <li key={item.name}>
                          <span className={styles.rankingItemNumber}>{i + 6}</span>
                          <Tooltip title={item.name}>
                            <span className={styles.rankingItemTitle}>{item.name}</span>
                          </Tooltip>
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
  ...circleMaster,
  loading: loading.effects['circleMaster/fetchMasterTotal'],
  loading2: loading.effects['circleMaster/fetchMasterTotalList'],
}))(MasterTotalInfo);
