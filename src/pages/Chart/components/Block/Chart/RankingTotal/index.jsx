import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Card, Typography, Row, Col, Tooltip, Empty } from 'antd';
import styles from './style.less';

/**
 * 店铺营收排行 & 销售排行
 */
const RankingTotal = ({
  searchData, // 营收排行搜索参数
  timeData, // 销售排行搜索参数
  dispatch,
  incomeRank,
  saleRank,
  loading,
  loadingSale,
}) => {
  useEffect(() => {
    fetchChartBlockIncomeLeft(searchData);
  }, [searchData]);

  useEffect(() => {
    fetchChartBlockSaleRight(timeData);
  }, [timeData]);

  // 获取统计数据
  const fetchChartBlockSaleRight = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockSaleRight',
      payload,
    });
  };

  // 获取统计数据
  const fetchChartBlockIncomeLeft = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockIncomeLeft',
      payload,
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
    },
    {
      title: (
        <span>
          总销售额<br></br><span style={{ fontSize: 12, color: '#00000057' }}>(扫码支付+线上销售)</span>
        </span>
      ),
      align: 'right',
      dataIndex: 'allTotal',
    },
    {
      title: '扫码支付',
      align: 'right',
      dataIndex: 'scan',
    },
    {
      title: '线上销售',
      align: 'right',
      dataIndex: 'verificationFee',
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
      title: '店铺销售额排行 TOP10',
      columns: getColumns,
      rowKey: 'bus',
      loading: loading,
      list: incomeRank,
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
                        key={ctiele.title}
                      >
                        {ctiele.title}
                      </span>
                    ) : (
                      <span className={styles.totalItemTitle} key={ctiele.title}>
                        {ctiele.title}
                      </span>
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
                        {items[item.columns[1].dataIndex]}
                      </span>
                      <span className={styles.rankingItemValue}>
                        {items[item.columns[2].dataIndex]}
                        {item.rowKey === 'bus' && ' %'}
                      </span>
                      <span className={styles.rankingItemValue}>
                        {items[item.columns[3].dataIndex]}
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
  incomeRank: chartBlock.incomeRank,
  saleRank: chartBlock.saleRank,
  loading: loading.effects['chartBlock/fetchChartBlockIncomeLeft'],
  loadingSale: loading.effects['chartBlock/fetchChartBlockSaleRight'],
}))(RankingTotal);
