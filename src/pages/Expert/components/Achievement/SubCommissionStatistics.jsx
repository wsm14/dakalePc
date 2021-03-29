import React from 'react';
import { connect } from 'umi';
import { Modal, Statistic, Row, Col } from 'antd';
import { EXPERT_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const SubCommissionStatistics = (props) => {
  const { subList, subTotal, loading, visible = {}, onClose } = props;

  const { show = false, detail = {} } = visible;

  const { username, levelKey, mobile, kolUserId } = detail;

  // 统计数据
  const {
    cumulativeCommission = 0,
    pendingCommission = 0,
    dividedCommissionsThisMonth = 0,
    accountBalance = 0,
  } = subTotal;

  const totalItem = [
    {
      title: '累计分佣',
      total: Number(cumulativeCommission),
    },
    {
      title: '待分佣',
      total: Number(pendingCommission),
    },
    {
      title: '本月已分佣',
      total: Number(dividedCommissionsThisMonth),
    },
    {
      title: '账户余额',
      total: Number(accountBalance),
    },
  ];

  const getColumns = [
    {
      title: '时间',
      dataIndex: 'gainMonth',
    },
    {
      title: '预估收入',
      align: 'right',
      dataIndex: 'estimatedIncome',
      render: (val) => `￥ ${val}`,
    },
    {
      title: '结算收入',
      align: 'right',
      dataIndex: 'settlementIncome',
      render: (val) => `￥ ${val}`,
    },
    {
      title: '预代扣税',
      align: 'right',
      dataIndex: 'withholdingTax',
      render: (val) => `￥ ${val || 0}`,
    },
  ];

  return (
    <Modal
      title={`分佣统计 - ${username} | ${mobile} | ${EXPERT_TYPE[levelKey]}`}
      width={1300}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={onClose}
    >
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {totalItem.map((item) => (
          <Col span={6} key={item.title}>
            <Statistic title={item.title} value={item.total} precision={2} suffix="元" />
          </Col>
        ))}
      </Row>
      <TableDataBlock
        noCard={false}
        size="middle"
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.gainMonth}`}
        params={{ kolUserId }}
        dispatchType="expertUserAchievement/fetchExpertUserSubCommissionStatistics"
        {...subList}
      />
    </Modal>
  );
};

export default connect(({ expertUserAchievement, loading }) => ({
  subList: expertUserAchievement.subList,
  subTotal: expertUserAchievement.subTotal,
  loading: loading.effects['expertUserAchievement/fetchExpertUserSubCommissionStatistics'],
}))(SubCommissionStatistics);
