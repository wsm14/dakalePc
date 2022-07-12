import React from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import DrawerCondition from '@/components/DrawerCondition';

// 助力详情
const HelpDetailDrawer = (props) => {
  const { visible, onClose, dataList, loading } = props;
  const { show = false, row = {} } = visible;

  // 搜索参数
  const searchItems = [
    {
      label: '用户信息',
      name: 'name',
      type: 'user',
      span: 18,
    },
  ];

  const getColumns = [
    {
      title: '邀请用户',
      align: 'center',
      dataIndex: 'scensesName',
    },
    {
      title: '用户所属地区',
      align: 'center',
      dataIndex: 'scenedsName',
    },
    {
      title: '被邀请时间',
      align: 'center',
      dataIndex: 'scenesasName',
    },
  ];

  const modalProps = {
    title: `助力详情`,
    visible: show,
    onClose,
    width: 700,
    zIndex: 1001,
  };

  return (
    <DrawerCondition {...modalProps}>
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
      ></TableDataBlock>
    </DrawerCondition>
  );
};

export default connect(({ addNewActivity, loading }) => ({
  dataList: addNewActivity.dataList,
  loading:
    loading.effects['addNewActivity/fetchMarketAddNewActivityAdd'] ||
    loading.effects['addNewActivity/fetchMarketAddNewActivityEdit'],
}))(HelpDetailDrawer);
