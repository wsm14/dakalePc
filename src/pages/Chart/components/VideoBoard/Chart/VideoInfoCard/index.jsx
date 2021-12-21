import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Card, Typography, Row, Col, Tooltip, Empty } from 'antd';
import styles from './style.less';
import Column from 'antd/lib/table/Column';

/**
 * 店铺营收排行 & 销售排行
 */
const RankingTotal = (props) => {
  const { data, loading } = props;
  const { momentStatistic = {} } = data;
  const { addMomentMap = {} } = momentStatistic;
  const { probeShopMomentCount, commerceMomentCount, ugcMap = {} } = addMomentMap;
  const coloffLeft = { xs: 7, sm: 7, md: 7, lg: 7, xl: 4, xxl: 4 };
  return (
    <Col {...coloffLeft}>
      <Card
        loading={loading}
        style={{
          marginTop: 20,
          width: '100%',
          height: '480px',
        }}
        bordered={false}
        bodyStyle={{
          padding: 10,
          paddingTop: 24,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography.Title level={5}>新增视频情况</Typography.Title>
        <div className={styles.box}>
          <div className={styles.tit_c}>PGC视频</div>
          <div className={styles.content}>
            <div className={styles.c_tit}>
              探店视频：<span className={styles.num}>{probeShopMomentCount || 0}</span>
            </div>
            <div className={styles.c_tit}>
              带货视频：<span className={styles.num}>{commerceMomentCount || 0}</span>
            </div>
          </div>
          <div className={styles.tit_c}>UGC视频</div>
          <div className={styles.content}>
            {Object.keys(ugcMap).map((item) => {
              return (
                <div className={styles.c_tit} key={item}>
                  {item}：<span className={styles.num}>{ugcMap[item] || 0}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </Col>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['videoBoard/fetchMomentKanBan'],
}))(RankingTotal);
