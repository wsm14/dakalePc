import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Typography, Row, Col, Tooltip, Empty } from 'antd';
import numeral from 'numeral';
import styles from './style.less';

/**
 * 店铺营收排行 & 销售排行
 */
const RankingTotal = ({ searchData, dispatch, saleRank, loading, loadingSale }) => {
  useEffect(() => {
    fetchChartBlockSaleRight(searchData);
  }, [searchData]);

  // 获取统计数据
  const fetchChartBlockSaleRight = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockSaleRight',
      payload,
    });
  };

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
      dataIndex: 'sellName',
    },
    {
      title: '拜访次数',
      align: 'right',
      dataIndex: 'visitTimes',
    },
    {
      title: '入驻店铺数',
      align: 'right',
      dataIndex: 'settleCount',
    },
    {
      title: '激活店铺数',
      align: 'right',
      dataIndex: 'activeCount',
    },
  ];

  const tableArr = [
    {
      title: '店铺营收排行 TOP10',
      columns: getColumns,
      rowKey: 'bus',
      loading: loading,
      list: [],
    },
    {
      title: '销售排行 TOP10（按入驻店铺排行）',
      columns: getColumnsSale,
      rowKey: 'name',
      loading: loadingSale,
      list: saleRank,
    },
  ];

  return (
    <Row gutter={20}>
      {tableArr.map((item) => (
        <Col span={12} key={item.title}>
          <Card
            bordered={false}
            loading={item.loading}
            style={{ marginTop: 20, width: '100%' }}
            bodyStyle={{ paddingBottom: item.loading ? 24 : 16 }}
          >
            <Typography.Title level={5}>{item.title}</Typography.Title>
            <div className={styles.chartRank}>
              <ul className={styles.chartRankList}>
                <li>
                  {item.columns.map((ctiele, i) =>
                    i === 0 ? (
                      <span
                        style={{ width: '40%', textAlign: 'center', fontSize: 15, fontWeight: 600 }}
                      >
                        {ctiele.title}
                      </span>
                    ) : (
                      <span className={styles.totalItemTitle}>{ctiele.title}</span>
                    ),
                  )}
                </li>
                {item.list.length ? (
                  item.list.map((items, i) => (
                    <li key={items[item.columns[0].dataIndex]}>
                      <span style={{ width: '40%', display: 'flex' }}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <Tooltip title={items[item.columns[0].dataIndex]}>
                          <span className={styles.rankingItemTitle}>
                            {items[item.columns[0].dataIndex]}
                          </span>
                        </Tooltip>
                      </span>
                      <span className={styles.rankingItemValue}>
                        {item.rowKey === 'bus' && '￥ '}
                        {numeral(items[item.columns[1].dataIndex]).format('0,0')}
                      </span>
                      <span className={styles.rankingItemValue}>
                        {numeral(items[item.columns[2].dataIndex]).format('0,0')}
                        {item.rowKey === 'bus' && ' %'}
                      </span>
                      <span className={styles.rankingItemValue}>
                        {numeral(items[item.columns[3].dataIndex]).format('0,0')}
                        {item.rowKey === 'bus' && ' %'}
                      </span>
                    </li>
                  ))
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </ul>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default connect(({ chartBlock, loading }) => ({
  saleRank: chartBlock.saleRank,
  loading: loading.effects['chartBlock/fetchChartBlockSaleLeft'],
  loadingSale: loading.effects['chartBlock/fetchChartBlockSaleRight'],
}))(RankingTotal);
