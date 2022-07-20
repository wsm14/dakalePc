import React from 'react';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import DrawerCondition from '@/components/DrawerCondition';

// 助力详情
const HelpDetailDrawer = (props) => {
  const { visible, onClose, dataList, loading } = props;
  const { show = false, data = {} } = visible;

  // 搜索参数
  const searchItems = [
    {
      label: '助力用户',
      name: 'helpUserId',
      type: 'user',
      span: 18,
    },
  ];

  const getColumns = [
    {
      title: '邀请用户',
      width: 160,
      align: 'center',
      dataIndex: 'helpUserName',
      render: (val, row) => `${row?.helpUserMobile || ''}\n${val || ''}\n${row?.helpUserId || ''}`,
    },
    {
      title: '用户所属地区',
      align: 'center',
      dataIndex: 'helpUserDistrictCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '被邀请时间',
      align: 'center',
      dataIndex: 'createTime',
    },
  ];

  const modalProps = {
    title: `助力详情 - ${data.fissionName}`,
    visible: show,
    onClose,
    width: 800,
    zIndex: 1001,
  };

  return (
    <DrawerCondition {...modalProps}>
      <TableDataBlock
        order
        noCard={false}
        scrollY={600}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(row) => `${row.userFissionHelpId}`}
        params={{ userFissionId: data.userFissionId }}
        dispatchType="activicyAssistance/fetchActivicyAssistanceDetail"
        {...dataList}
      ></TableDataBlock>
    </DrawerCondition>
  );
};

export default connect(({ activicyAssistance, loading }) => ({
  dataList: activicyAssistance.detailList,
  loading: loading.effects['activicyAssistance/fetchActivicyAssistanceDetail'],
}))(HelpDetailDrawer);
