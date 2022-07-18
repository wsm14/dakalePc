import React, { useState } from 'react';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import { ACTIVICY_ASSISTANCE_PRIZETYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import HelpDetailDrawer from './HelpDetailDrawer';

function ActivicyAssistance(props) {
  const { list, loading } = props;

  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '发起用户',
      type: 'user',
      name: 'initiateUserId',
    },
    {
      label: '活动名称',
      name: 'fissionName',
    },
    {
      label: '奖品类型',
      name: 'fissionPrizeType',
      type: 'select',
      select: ACTIVICY_ASSISTANCE_PRIZETYPE,
    },
    {
      label: '发起日期',
      type: 'rangePicker',
      name: 'createBeginTime',
      end: 'createEndTime',
    },
    {
      label: '用户所属地区',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['initiateUserProvinceCode', 'initiateUserCityCode', 'initiateUserDistrictCode'],
      placeholder: '请选择',
    },
    {
      label: '奖品名称',
      name: 'fissionPrizeName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '活动名称',
      dataIndex: 'fissionName',
      ellipsis: true,
    },
    {
      title: '邀请人数',
      align: 'right',
      dataIndex: 'fissionInviteNum',
      render: (val) => `${val}人`,
    },
    {
      title: '奖品类型/标签',
      align: 'center',
      dataIndex: 'fissionPrizeType',
      render: (val) => ACTIVICY_ASSISTANCE_PRIZETYPE[val],
    },
    {
      title: '奖品名称/ID',
      dataIndex: 'fissionPrizeName',
      width: 180,
      render: (val, row) => `${val}\n${row.fissionPrizeId}`,
    },
    {
      title: '发起日期',
      dataIndex: 'createTime',
    },
    {
      title: '发起用户信息',
      dataIndex: 'initiateUserInfo',
      render: (val) => {
        const userData = JSON.parse(val);
        return `${userData?.mobile || ''}\n${userData?.username || ''}\n${userData?.id || ''}`;
      },
    },
    {
      title: '用户所属地区',
      align: 'center',
      dataIndex: 'initiateUserDistrictCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '当前进度',
      align: 'center',
      dataIndex: 'invitedNum',
      render: (val, row) =>
        row.fissionInviteNum == val
          ? `邀请${val}人`
          : `邀请${val}人，还差${row.fissionInviteNum - val}人`,
    },
    {
      title: '完成时间',
      dataIndex: 'inviteCompletedTime',
    },
    {
      type: 'handle',
      dataIndex: 'fissionId',
      render: (val, row) => [
        {
          type: 'assistanceInfo',
          click: () => setVisible({ show: true, data: row }),
        },
      ],
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        noCard={false}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.fissionId}`}
        dispatchType="activicyAssistance/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 助力详情 */}
      <HelpDetailDrawer visible={visible} onClose={() => setVisible(false)}></HelpDetailDrawer>
    </>
  );
}

export default connect(({ activicyAssistance, loading }) => ({
  list: activicyAssistance.list,
  loading: loading.effects['activicyAssistance/fetchGetList'],
}))(ActivicyAssistance);
