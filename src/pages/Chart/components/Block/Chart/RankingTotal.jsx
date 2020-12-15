import React from 'react';
import { connect } from 'dva';
import { Card, Typography, Row, Col } from 'antd';
import DataTableBlock from '@/components/DataTableBlock';
import numeral from 'numeral';
import styles from './style.less';

const RankingTotal = ({ searchData, totalData, loading }) => {
  // table 表头
  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'userMerchantIdString',
    },
    {
      title: '营收金额',
      align: 'right',
      dataIndex: 'merchantName',
    },
    {
      title: '扫码支付',
      align: 'right',
      dataIndex: 'account',
    },
    {
      title: '在线支付',
      align: 'right',
      dataIndex: 'totalAdd',
    },
  ];

  // table 表头
  const getColumnsSale = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '拜访次数',
      align: 'right',
      dataIndex: 'merchantName',
    },
    {
      title: '入驻店铺数',
      align: 'right',
      dataIndex: 'account',
    },
    {
      title: '激活店铺数',
      align: 'right',
      dataIndex: 'totalAdd',
    },
  ];

  const tableArr = [
    {
      title: '店铺营收排行 TOP10',
      columns: getColumns,
      rowKey: 'userMerchantIdString',
      list: [{}],
    },
    {
      title: '销售排行 TOP10（按入驻店铺排行）',
      columns: getColumnsSale,
      rowKey: 'name',
      list: [],
    },
  ];

  const rankList = [
    {
      name:
        'aljda啊三菱电机卡来得及阿来得及阿来得及啊三菱电机阿来得及啊三菱电机啊冷静阿来得及俺删了',
    },
    {
      name:
        'aljda啊三菱电机卡来得及阿来得及阿来得及啊三菱电机阿来得及啊三菱电机啊冷静阿来得及俺删了',
    },
    {
      name:
        'aljda啊三菱电机卡来得及阿来得及阿来得及啊三菱电机阿来得及啊三菱电机啊冷静阿来得及俺删了',
    },
    {
      name:
        'aljda啊三菱电机卡来得及阿来得及阿来得及啊三菱电机阿来得及啊三菱电机啊冷静阿来得及俺删了',
    },
    {
      name:
        'aljda啊三菱电机卡来得及阿来得及阿来得及啊三菱电机阿来得及啊三菱电机啊冷静阿来得及俺删了',
    },
    {
      name:
        'aljda啊三菱电机卡来得及阿来得及阿来得及啊三菱电机阿来得及啊三菱电机啊冷静阿来得及俺删了',
    },
    {
      name:
        'aljda啊三菱电机卡来得及阿来得及阿来得及啊三菱电机阿来得及啊三菱电机啊冷静阿来得及俺删了',
    },
    {
      name:
        'aljda啊三菱电机卡来得及阿来得及阿来得及啊三菱电机阿来得及啊三菱电机啊冷静阿来得及俺删了',
    },
    {
      name:
        'aljda啊三菱电机卡来得及阿来得及阿来得及啊三菱电机阿来得及啊三菱电机啊冷静阿来得及俺删了',
    },
    {
      name:
        'aljda啊三菱电机卡来得及阿来得及阿来得及啊三菱电机阿来得及啊三菱电机啊冷静阿来得及俺删了',
    },
  ];

  return (
    <Row gutter={20} align="middle">
      {tableArr.map((item) => (
        <Col span={12} key={item.title}>
          <Card
            bordered={false}
            loading={loading}
            style={{ marginTop: 20, width: '100%' }}
            bodyStyle={{ paddingBottom: loading ? 24 : 16 }}
          >
            <Typography.Title level={5}>{item.title}</Typography.Title>
            <div className={styles.chartRank}>
              <ul className={styles.chartRankList}>
                <li>
                  <span style={{ width: '40%', textAlign: 'center', fontSize: 15 }}>店铺名称</span>
                  <span className={styles.totalItemTitle}>营收金额</span>
                  <span className={styles.totalItemTitle}>扫码支付</span>
                  <span className={styles.totalItemTitle}>在线支付</span>
                </li>
                {rankList.map((item, i) => (
                  <li key={item.name}>
                    <span style={{ width: '40%', display: 'flex' }}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle}>{item.name}</span>
                    </span>
                    <span className={styles.rankingItemValue}>
                      {numeral(item.total).format('0,0')}
                    </span>
                    <span className={styles.rankingItemValue}>
                      {numeral(item.total).format('0,0')}
                    </span>
                    <span className={styles.rankingItemValue}>
                      {numeral(item.total).format('0,0')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['chartBlock/fetchChartBlockOrder'],
}))(RankingTotal);
