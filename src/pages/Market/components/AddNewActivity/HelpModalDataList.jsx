import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
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
      name: 'name',
      type: 'user',
    },
  ];

  const getColumns = [
    {
      title: '发起人',
      align: 'center',
      dataIndex: 'scenesName',
    },
    {
      title: '用户所属地区',
      align: 'center',
      dataIndex: 'scensesName',
    },
    {
      title: '当前进度',
      align: 'center',
      dataIndex: 'scenedsName',
    },
    {
      title: '邀请完成时间',
      align: 'center',
      dataIndex: 'scenesasName',
    },
    {
      title: '奖品领取状态',
      dataIndex: 'image',
    },
    {
      title: '领取奖品名称',
      dataIndex: 'imsdage',
    },
    {
      title: '领取时间',
      dataIndex: 'imadage',
    },
    {
      type: 'handle',
      dataIndex: 'value',
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
      title={`数据`}
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
        rowKey={(row) => `${row.categoryScenesId}`}
        params={{ configFissionTemplateId: row.configFissionTemplateId }}
        dispatchType="addNewActivity/fetchMarketAddNewActivityDataList"
        {...dataList}
        list={[1]}
      ></TableDataBlock>
      {/* 助力详情 */}
      <HelpDetailDrawer
        visible={visibleDetail}
        onClose={() => setVisibleDetail(false)}
      ></HelpDetailDrawer>
    </Modal>
  );
};
export default connect(({ addNewActivity, loading }) => ({
  dataList: addNewActivity.dataList,
  loading: loading.effects['addNewActivity/fetchMarketAddNewActivityDataList'],
}))(HelpModalDataList);
