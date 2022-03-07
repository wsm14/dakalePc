import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { WXCOMMUNITY_WITHDRAW_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const WchatCommunityList = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 新增弹窗

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
      select: WXCOMMUNITY_WITHDRAW_STATUS,
    },
    {
      label: '提现账户',
      type: 'select',
      name: 'withdrawalAccount',
    },

    {
      label: '用户昵称',
      type: 'username',
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
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      title: '审核状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => WXCOMMUNITY_WITHDRAW_STATUS[val],
    },
    // {
    //   type: 'handle',
    //   dataIndex: 'directWithdrawalAuditId',
    //   render: (userTempLevelId, row) => [
    //     {
    //       type: 'cancelTemp',
    //       pop: true,
    //       visible: row.status === '1',
    //       click: () => fetchExpertStop({ userTempLevelId }),
    //     },
    //   ],
    // },
  ];

  // 取消实习
  const fetchExpertStop = (values) => {
    dispatch({
      type: 'expertTempList/fetchExpertTempStop',
      payload: values,
      callback: childRef.current.fetchGetData,
    });
  };

  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.directWithdrawalAuditId}`}
        // dispatchType="withdrawAudit/fetchWithdrawAuditCommunityList"
        // {...list}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ withdrawAudit, loading }) => ({
  list: withdrawAudit.communityList,
  loading: loading.models.withdrawAudit,
}))(WchatCommunityList);
