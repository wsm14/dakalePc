import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Card, Typography, Row, Col, Tooltip, Empty } from 'antd';
import styles from './style.less';

/**
 * 店铺营收排行 & 销售排行
 */
const RankingTotal = (props) => {
  const { data, loading } = props;
  const { PGCMomentRewardStatistic = {}, UGCMomentRewardStatistic = {} } = data;
  const coloffLeft = { xs: 17, sm: 17, md: 17, lg: 17, xl: 10, xxl: 10 };

  return (
    <Col {...coloffLeft}>
      <Card
        style={{ marginTop: 20, width: '100%', height: '480px' }}
        bordered={false}
        loading={loading}
        bodyStyle={{
          paddingBottom: 24,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography.Title level={5}>视频打赏情况</Typography.Title>
        <div className={styles.box}>
          <div className={styles.s_box}>
            <div className={styles.tit}>PGC视频</div>
            <div className={styles.left}>领取卡豆数：</div>
            <div className={styles.center}>{PGCMomentRewardStatistic.PGCRewardBeanSum || 0}</div>
            <div className={styles.left}>领取人数：</div>
            <div className={styles.center}>{PGCMomentRewardStatistic.PGCRewardPersonSum || 0}</div>
          </div>
          <div className={styles.s_box}>
            <div className={styles.tit}>UGC视频</div>
            <div className={styles.left}>打赏卡豆数：</div>
            <div className={styles.center}>{UGCMomentRewardStatistic.UGCRewardBeanSum || 0}</div>
            <div className={styles.left}>打赏人数：</div>
            <div className={styles.center}>{UGCMomentRewardStatistic.UGCRewardPersonSum || 0}</div>
          </div>
        </div>
      </Card>
    </Col>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['videoBoard/fetchMomentKanBan'],
}))(RankingTotal);
