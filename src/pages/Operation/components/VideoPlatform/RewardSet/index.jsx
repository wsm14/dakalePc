import React, { useRef, useState } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import { NEW_SHAREREWARD_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import RewardCreate from './RewardCreate';

/**
 * 打赏设置
 * type videoAdvert 视频广告 新增时没有画像设置
 */
const RewardSet = ({ list, type, visible, onClose, dispatch, loading }) => {
  const childRef = useRef(); // 表格ref
  const [visibleCreate, setVisibleCreate] = useState(false); // 创建打赏

  const { show = false, detail = {} } = visible;

  const { districtCode, momentId, ownerId } = detail;

  // table 表头
  const getColumns = [
    {
      title: '投放时长',
      dataIndex: 'tippingTimeType',
      render: (val, row) =>
        ({
          permanent: row.finishTime ? `${row.createTime} ~ ${row.finishTime}` : '扣完为止',
          fixed: `${row?.beginDate} ~ ${row?.finishTime || row?.endDate}`,
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
    const { momentId, momentTippingId } = row;
    dispatch({
      type: 'videoPlatform/fetchNewShareRewardCancel',
      payload: {
        momentId,
        momentTippingId,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  const extraBtn = [
    {
      auth: true,
      text: '新增打赏规则',
      onClick: () => setVisibleCreate(true),
    },
  ];

  return (
    <>
      <Modal
        title={`${detail.title} - 打赏设置`}
        destroyOnClose
        maskClosable
        width={1100}
        visible={show}
        footer={false}
        onCancel={onClose}
        zIndex={100}
      >
        <TableDataBlock
          noCard={false}
          cRef={childRef}
          loading={loading}
          btnExtra={extraBtn}
          columns={getColumns}
          params={{ momentId: detail.momentId }}
          rowKey={(record) => record.momentTippingId}
          dispatchType="videoPlatform/fetchNewShareRewardSetList"
          {...list}
        ></TableDataBlock>
      </Modal>
      {/* 创建打赏 */}
      <RewardCreate
        type={type}
        params={{ momentId, ownerId }}
        cityName={checkCityName(districtCode)}
        childRef={childRef}
        visible={visibleCreate}
        onClose={() => setVisibleCreate(false)}
      ></RewardCreate>
    </>
  );
};

export default connect(({ videoPlatform, loading }) => ({
  list: videoPlatform.rewardList,
  loading: loading.effects['videoPlatform/fetchNewShareRewardSetList'],
}))(RewardSet);
