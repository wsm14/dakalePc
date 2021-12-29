import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Card, Row, Col, Descriptions, Progress } from 'antd';
import { GMV_DATA_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import QuestionTooltip from '@/components/QuestionTooltip';
import style from './OrderChart.less';

/**
 * 营收统计
 */
const OrderChart = ({ dispatch, searchData = {}, GMVObject, loading }) => {
  const {
    GMVStatisticList = [],
    verificationStatisticList = [],
    refundStatisticList = [],
    displaceGoodGMVStatistic = {},
    displaceGoodVerificationStatistic = {},
  } = GMVObject;

  useEffect(() => {
    fetchGetTotalData();
  }, [searchData]);

  // 获取统计数据
  const fetchGetTotalData = () => {
    dispatch({
      type: 'chartBlock/fetchChartBusinessStatistic',
      payload: searchData,
    });
  };

  // 平台GMV表头
  const GMVGetColumns = [
    {
      title: '订单类型',
      align: 'right',
      dataIndex: 'orderType',
      width: 100,
      render: (val) => GMV_DATA_TYPE[val],
    },
    {
      title: 'GMV',
      align: 'right',
      dataIndex: 'totalFee',
      render: (val) => {
        return (
          <div>
            <div>{val}</div>
            <Progress
              percent={
                ((Number(val) / Number(GMVStatisticList[0]?.totalFee)) * 100).toFixed(0) || 0
              }
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: '订单数',
      align: 'right',
      dataIndex: 'count',
      width: 90,
    },
  ];
  // 核销总额表头
  const cancelGetColumns = [
    {
      title: '订单类型',
      align: 'right',
      dataIndex: 'orderType',
      width: 110,
      render: (val) =>
        val === 'expiredOrder' ? (
          <QuestionTooltip
            title="过期不可退"
            content="指发布商品/券时选了过期不可退，但是到期后仍未核销的订单金额（按用户支付总金额），统计特惠商品、优惠券、权益商品、权益券的订单总金额。"
            type="quest"
          ></QuestionTooltip>
        ) : (
          GMV_DATA_TYPE[val]
        ),
    },
    {
      title: '核销金额',
      align: 'right',
      dataIndex: 'totalFee',
      render: (val) => {
        return (
          <div>
            <div>{val}</div>
            <Progress
              percent={
                val === '0.00'
                  ? 0
                  : ((Number(val) / Number(verificationStatisticList[0]?.totalFee)) * 100).toFixed(
                      0,
                    ) || 0
              }
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: '核销数',
      align: 'right',
      dataIndex: 'count',
      width: 90,
    },
  ];
  // 退款总额表头
  const refundGetColumns = [
    {
      title: '订单类型',
      align: 'right',
      dataIndex: 'orderType',
      width: 100,
      render: (val) => GMV_DATA_TYPE[val],
    },
    {
      title: '退款金额',
      align: 'right',
      dataIndex: 'totalFee',
      render: (val) => {
        return (
          <div>
            <div>{val}</div>
            <Progress
              percent={
                ((Number(val) / Number(refundStatisticList[0]?.totalFee)) * 100).toFixed(0) || 0
              }
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: '退款订单数',
      align: 'right',
      dataIndex: 'count',
      width: 90,
    },
  ];

  // 计算总金额
  const addNum = (arr = []) => {
    return arr.reduce((preValue, curValue) => preValue + Number(curValue.totalFee), 0);
  };
  // 表格头部标题内容方法
  const content = (title, money) => {
    return (
      <div
        style={{
          height: 40,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '16px',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>{title}</span>
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{`￥${money.toFixed(2)}`}</span>
      </div>
    );
  };
  return (
    <Card
      bodyStyle={{ padding: '0 12px 12px' }}
      loading={loading}
      bordered={false}
      style={{ marginTop: 20, height: '100%' }}
    >
      <Row gutter={24}>
        <Col flex={1}>
          <TableDataBlock
            tableSize="small"
            bordered={true}
            pagination={false}
            content={content('平台GMV：', addNum(GMVStatisticList))}
            noCard={false}
            loading={loading}
            columns={GMVGetColumns}
            rowKey={(record) => `${record.orderType}`}
            list={GMVStatisticList}
          ></TableDataBlock>
        </Col>
        <Col flex={1}>
          <TableDataBlock
            tableSize="small"
            bordered={true}
            pagination={false}
            content={content('核销总额：', addNum(verificationStatisticList))}
            noCard={false}
            loading={loading}
            columns={cancelGetColumns}
            rowKey={(record) => `${record.orderType}`}
            list={verificationStatisticList}
          ></TableDataBlock>
          <Descriptions
            size="small"
            className={style.descriptions}
            title={
              <div
                style={{
                  height: 40,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <QuestionTooltip
                  title="置换商品"
                  content="指特惠商品和平台权益商品中打了“福利商品”标签的商品的销售额。"
                  type="quest"
                ></QuestionTooltip>
              </div>
            }
            bordered
            column={2}
          >
            <Descriptions.Item label="销售额">{`￥${
              displaceGoodGMVStatistic?.GMVTotalFee || 0.0
            }`}</Descriptions.Item>
            <Descriptions.Item label="订单数">{`${
              displaceGoodGMVStatistic?.GMVCount || 0
            }`}</Descriptions.Item>
            <Descriptions.Item label="核销额">{`￥${
              displaceGoodVerificationStatistic?.verificationTotalFee || 0.0
            }`}</Descriptions.Item>
            <Descriptions.Item label="核销数">{`${
              displaceGoodVerificationStatistic?.verificationCount || 0
            }`}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col flex={1}>
          <TableDataBlock
            tableSize="small"
            bordered={true}
            pagination={false}
            content={content('退款总额：', addNum(refundStatisticList))}
            noCard={false}
            loading={loading}
            columns={refundGetColumns}
            rowKey={(record) => `${record.orderType}`}
            list={refundStatisticList}
          ></TableDataBlock>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ chartBlock, loading }) => ({
  GMVObject: chartBlock.GMVObject,
  loading: loading.effects['chartBlock/fetchChartBusinessStatistic'],
}))(OrderChart);
