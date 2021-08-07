import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { EXPERT_TYPE, EXPERT_IS_WITHDRAW } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import ExpertAllocationSet from './components/Allocation/ExpertAllocationSet';

const ExpertAllocation = (props) => {
  const { list, loading } = props;

  const [visible, setVisible] = useState(false); // 配置修改新增

  const childRef = useRef();
  // table 表头
  const getColumns = [
    {
      title: '',
      children: [
        {
          title: '身份',
          dataIndex: 'type',
          fixed: 'left',
          width: 150,
          render: (val) => EXPERT_TYPE[val],
        },
        {
          title: '等级',
          dataIndex: 'levelName',
          fixed: 'left',
          align: 'center',
          width: 100,
        },
        {
          title: '图标',
          dataIndex: ['levelExtraParamObject', 'levelIcon'],
          align: 'center',
          width: 150,
          render: (val) => <PopImgShow url={val}></PopImgShow>,
        },
      ],
    },
    {
      title: '升级条件',
      children: [
        {
          title: '升级图标',
          dataIndex: ['levelExtraParamObject', 'upLevelIcon'],
          align: 'center',
          render: (val) => <PopImgShow url={val}></PopImgShow>,
        },
        {
          title: '直推用户数',
          dataIndex: ['userLevelTargetObject', 'normal'],
          align: 'right',
        },
        {
          title: '直推哒人数',
          dataIndex: ['userLevelTargetObject', 'daren'],
          align: 'right',
        },
      ],
    },
    {
      title: '升级权益',
      children: [
        {
          title: '自购/分销奖励（%）',
          dataIndex: 'shareCommission',
          align: 'right',
          render: (val) => val && `${val}%`,
        },
        {
          title: '团队奖励（%）',
          dataIndex: 'teamCommission',
          align: 'right',
          render: (val) => val && `${val}%`,
        },
        {
          title: '消费抵扣（卡豆）',
          dataIndex: 'payBeanCommission',
          align: 'right',
          render: (val) => val && `${val}%`,
        },
        {
          title: '解锁奖励（卡豆）',
          dataIndex: 'unlockRewardsBean',
          align: 'right',
          render: (val) => val && `${val}%`,
        },
        {
          title: '是否可提现',
          dataIndex: 'isWithdraw',
          align: 'right',
          render: (val) => EXPERT_IS_WITHDRAW[val],
        },
      ],
    },
    {
      title: '升级要求',
      children: [
        {
          title: '核销笔数要求（笔）',
          dataIndex: ['userLevelTargetObject', 'verificationCount'],
          align: 'right',
          render: (val) => val && `${val}笔`,
        },
        {
          title: '业绩流水要求（元）',
          dataIndex: ['userLevelTargetObject', 'performance'],
          align: 'right',
          render: (val) => val && `${val}元`,
        },
      ],
    },
    {
      title: '月度奖金',
      children: [
        {
          title: '核销笔数要求（笔）',
          dataIndex: ['userLevelMonthBonusObject', 'verificationNum'],
          align: 'right',
          render: (val) => val && `${val}笔`,
        },
        {
          title: '业绩流水要求（元）',
          dataIndex: ['userLevelMonthBonusObject', 'performanceFlow'],
          align: 'right',
          render: (val) => val && `${val}元`,
        },
        {
          title: '业绩达标奖金（元）',
          dataIndex: ['userLevelMonthBonusObject', 'performanceBonus'],
          align: 'right',
          render: (val) => val && `${val}元`,
        },
      ],
    },
    {
      type: 'handle',
      dataIndex: 'levelName',
      render: (val, row) => [
        {
          auth: 'save',
          title: '新增等级',
          visible: !!row.children,
          click: () => setVisible({ show: true, type: 'add', detail: row }),
        },
        {
          type: 'edit',
          visible: !row.children || row.type == 'normal',
          click: () => setVisible({ show: true, type: 'edit', detail: row }),
        },
      ],
    },
  ];

  return (
    <>
      <TableDataBlock
        bordered
        size="middle"
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.type || record.levelName}`}
        dispatchType="expertAllocation/fetchGetList"
        expandable={{ expandedRowKeys: list.map((i) => i.type) }}
        list={list}
      ></TableDataBlock>
      <ExpertAllocationSet
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></ExpertAllocationSet>
    </>
  );
};

export default connect(({ expertAllocation, loading }) => ({
  list: expertAllocation.list,
  loading: loading.models.expertAllocation,
}))(ExpertAllocation);
