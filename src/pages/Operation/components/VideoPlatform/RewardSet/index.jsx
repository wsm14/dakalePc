import React, { useRef } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import { NEW_SHAREREWARD_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

/**
 * 打赏设置
 */
const RewardSet = ({ list, visible, onClose, dispatch, loading }) => {
  const childRef = useRef(); // 表格ref
  const { show = false, detail = {} } = visible;

  // table 表头
  const getColumns = [
    {
      title: '投放时长',
      dataIndex: 'tippingTimeType',
      render: (val, row) =>
        ({
          permanent: row.finishTime ? `${row.beginDate} ~ ${row.finishTime}` : '扣完为止',
          fixed: `${row?.beginDate} ~ ${row?.endDate || row?.finishTime}`,
        }[val]),
    },
    {
      title: '单次曝光打赏',
      dataIndex: 'tippingBean',
      align: 'right',
      render: (val) => `${val} 卡豆/人`,
    },
    {
      title: '目标曝光量',
      align: 'right',
      dataIndex: 'tippingCount',
      render: (val) => `${val} 人`,
    },
    {
      title: '总需卡豆',
      align: 'right',
      dataIndex: 'tippingCount',
      render: (val, row) => `${val * row?.tippingBean} 卡豆`,
    },
    {
      title: '剩余卡豆',
      align: 'right',
      dataIndex: 'remainCount',
      render: (val, row) => `${val * row?.tippingBean} 卡豆`,
    },
    {
      title: '打赏状态',
      dataIndex: 'status',
      render: (val) => NEW_SHAREREWARD_STATUS[val],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
    },
    {
      type: 'handle',
      dataIndex: 'momentId',
      render: (val, row) => {
        return [
          {
            title: '停止打赏',
            auth: true,
            pop: true,
            visible: row.status != 0,
            click: () => fetchNewShareRewardCancel(row),
          },
        ];
      },
    },
  ];

  // 取消打赏
  const fetchNewShareRewardCancel = (row) => {
    const { momentId, ownerId } = row;
    dispatch({
      type: 'videoPlatform/fetchNewShareRewardCancel',
      payload: {
        momentId,
        ownerId,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  const extraBtn = [
    {
      auth: true,
      text: '新增打赏规则',
      onClick: () => setVisibleShare({ type: 'add', show: true }),
    },
  ];

  return (
    <Modal
      title={`${detail.title} - 打赏设置`}
      destroyOnClose
      maskClosable
      width={1100}
      visible={show}
      footer={false}
      onCancel={onClose}
    >
      <TableDataBlock
        btnExtra={extraBtn}
        noCard={false}
        cRef={childRef}
        columns={getColumns}
        loading={loading}
        rowKey={(record) => record.momentTippingId}
        params={{ momentId: detail.momentId }}
        dispatchType="videoPlatform/fetchNewShareRewardSetList"
        {...list}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ videoPlatform, loading }) => ({
  list: videoPlatform.rewardList,
  loading: loading.effects['videoPlatform/fetchNewShareRewardSetList'],
}))(RewardSet);
