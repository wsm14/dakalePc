import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { COMMUNITY_WITHDRAW_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import CommunityDetail from './CommunityDetail';

const WchatCommunityList = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 详情

  // 搜索参数
  const searchItems = [
    {
      label: '提现日期',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
    {
      label: '用户账号',
      name: 'mobile',
      placeholder: '请输入用户注册手机号',
    },
    {
      label: '审核状态',
      type: 'select',
      name: 'status',
      select: COMMUNITY_WITHDRAW_STATUS,
    },
    {
      label: '提现账户',
      name: 'withdrawalAccount',
    },
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '提现单号',
      name: 'incomeSn',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '提现单号',
      dataIndex: 'incomeSn',
    },

    {
      title: '提现日期',
      dataIndex: 'createTime',
    },
    {
      title: '需提现金额',
      align: 'right',
      dataIndex: 'withdrawalFee',
      render: (val) => `￥${val}`,
    },
    {
      title: '服务费(6‰)',
      align: 'right',
      dataIndex: 'chargeCash',
      render: (val) => `-￥${val}`,
    },
    {
      title: '卡豆抵扣',
      align: 'right',
      dataIndex: 'chargeBean',
      render: (val) => (Number(val) > 0 ? `${val}豆\n(￥${val / 100})` : 0),
    },
    {
      title: '实际提现金额',
      align: 'right',
      dataIndex: 'totalFee',
      render: (val) => `￥${val}`,
    },
    {
      title: '提现账户',
      align: 'center',
      dataIndex: 'withdrawalAccount',
    },
    {
      title: '用户昵称',
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: '用户账号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '审核状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => COMMUNITY_WITHDRAW_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'directWithdrawalAuditId',
      render: (val, row) => [
        {
          type: 'info',
          visible: row.status === '1',
          click: () => fetchGetDetail(val, 'info'),
        },
        {
          type: 'check',
          visible: record.status === '0',
          click: () => fetchGetDetail(val, 'check'),
        },
      ],
    },
  ];

  // 获取提现详情
  const fetchGetDetail = (id, type) => {
    dispatch({
      type: 'withdrawAudit/fetchWithdrawAuditCommunityDetail',
      payload: { directWithdrawalAuditId: id },
      callback: (detail) => setVisible({ show: true, type, detail }),
    });
  };

  return (
    <>
      <TableDataBlock
        order
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.directWithdrawalAuditId}`}
        dispatchType="withdrawAudit/fetchWithdrawAuditCommunityList"
        {...list}
      ></TableDataBlock>
      {/* 详情 */}
      <CommunityDetail
        cRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></CommunityDetail>
    </>
  );
};

export default connect(({ withdrawAudit, loading }) => ({
  list: withdrawAudit.communityList,
  loading: loading.models.withdrawAudit,
}))(WchatCommunityList);
