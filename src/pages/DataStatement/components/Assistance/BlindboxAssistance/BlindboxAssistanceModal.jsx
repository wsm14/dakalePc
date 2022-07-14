import React from 'react';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import DrawerCondition from '@/components/DrawerCondition';

function AssistanceModal(props) {
  const { infoList, visible, loading, onClose } = props;
  const { show = false, data = {} } = visible;

  // 搜索参数
  const searchItems = [
    {
      label: '助力用户',
      type: 'user',
      name: 'helpUserId',
      span: 18,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '助力用户昵称',
      dataIndex: 'userName',
      ellipsis: true,
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
      title: '用户所属地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '助力时间',
      dataIndex: 'createTime',
    },
  ];

  const modalProps = {
    title: `助力详情 - ${data.userName}`,
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
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.blindBoxHelpId}`}
        params={{ userId: data.userId, helpDate: data.helpDate }}
        dispatchType="blindboxAssistance/fetchAssistanceDetail"
        {...infoList}
      ></TableDataBlock>
    </DrawerCondition>
  );
}

export default connect(({ blindboxAssistance, loading }) => ({
  infoList: blindboxAssistance.info,
  loading: loading.effects['blindboxAssistance/fetchAssistanceDetail'],
}))(AssistanceModal);
