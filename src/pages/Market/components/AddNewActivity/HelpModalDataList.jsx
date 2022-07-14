import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import HelpDetailDrawer from './HelpDetailDrawer';

// 助力活动数据列表
const HelpModalDataList = (props) => {
  const { dataList, visible, onClose, loading } = props;
  const { show = false, row = {} } = visible;

  const [visibleDetail, setVisibleDetail] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '用户信息',
      name: 'initiateUserId',
      type: 'user',
    },
  ];

  const getColumns = [
    {
      title: '发起人',
      align: 'center',
      dataIndex: 'initiateUserInfo',
      render: (val) => `${val?.mobile || ''}\n${val?.username || ''}\n${val?.beanCode || ''}`,
    },
    {
      title: '用户所属地区',
      align: 'center',
      dataIndex: 'initiateUserDistrictCode',
      render: (val) => checkCityName(val),
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
      title: '邀请完成时间',
      align: 'center',
      dataIndex: 'inviteCompletedTime',
    },
    {
      title: '奖品领取状态',
      dataIndex: 'prizeCollectionStatus',
      render: (val) => ['未领取', '已领取'][val],
    },
    {
      title: '领取奖品名称',
      dataIndex: 'fissionPrizeName',
      render: (val) => `${val}`,
    },
    {
      title: '领取时间',
      dataIndex: 'receiveTime',
    },
    {
      type: 'handle',
      dataIndex: 'userFissionId',
      render: (val, row) => [
        {
          title: '助力详情',
          auth: true,
          click: () => setVisibleDetail({ show: true, row }),
        },
      ],
    },
  ];

  return (
    <Modal
      title={`数据 - ${row.name}`}
      width={1150}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={onClose}
    >
      <TableDataBlock
        order
        tableSize="midden"
        noCard={false}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(row) => `${row.userFissionId}`}
        params={{ fissionId: row.configFissionTemplateId }}
        dispatchType="activicyAssistance/fetchGetList"
        {...dataList}
      ></TableDataBlock>
      {/* 助力详情 */}
      <HelpDetailDrawer
        visible={visibleDetail}
        onClose={() => setVisibleDetail(false)}
      ></HelpDetailDrawer>
    </Modal>
  );
};
export default connect(({ activicyAssistance, loading }) => ({
  dataList: activicyAssistance.list,
  loading: loading.effects['activicyAssistance/fetchGetList'],
}))(HelpModalDataList);
