import React from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';

/**
 * 打赏明细
 */
const RewardSet = ({ list, visible, onClose, loading }) => {
  const { sumRewardBean, ...other } = list;

  const { show = false, detail = {} } = visible;

  const { ownerName, title, momentId } = detail;

  // 搜索参数
  const searchItems = [
    {
      label: '打赏时间',
      type: 'rangePicker',
      name: 'rewardBeginTime',
      end: 'rewardEndTime',
    },
    {
      label: '打赏用户',
      type: 'user',
      name: 'userId',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '打赏用户',
      dataIndex: 'userName',
    },
    {
      title: '用户手机号',
      dataIndex: 'mobile',
    },
    {
      title: '用户豆号',
      dataIndex: 'beanCode',
    },
    {
      title: '打赏卡豆数（个）',
      dataIndex: 'rewardBean',
    },
    {
      title: '打赏时间',
      dataIndex: 'createTime',
    },
  ];

  return (
    <>
      <Modal
        title={`打赏明细 - ${ownerName} - ${title}`}
        destroyOnClose
        maskClosable
        width={1100}
        visible={show}
        footer={false}
        onCancel={onClose}
        zIndex={100}
      >
        <TableDataBlock
          content={`累计卡豆数:${sumRewardBean}(卡豆)`}
          order={true}
          noCard={false}
          searchItems={searchItems}
          loading={loading}
          columns={getColumns}
          params={{ momentId }}
          rowKey={(record) => record.userRewardRecordId}
          dispatchType="videoPlatform/fetchUGCVideoRewardInfo"
          {...other}
        ></TableDataBlock>
      </Modal>
    </>
  );
};

export default connect(({ videoPlatform, loading }) => ({
  list: videoPlatform.infoList,
  loading: loading.effects['videoPlatform/fetchUGCVideoRewardInfo'],
}))(RewardSet);
