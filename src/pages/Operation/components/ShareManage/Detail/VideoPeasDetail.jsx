import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const VideoPeasDetail = (props) => {
  const { beanDetal, loading, visible, onClose, dispatch } = props;
  const { show = false, detail = {} } = visible;

  const { momentId: userMomentIdString, ownerName } = detail;

  // 关闭清除数据
  const fetchCloseModal = () => {
    dispatch({
      type: 'shareManage/closeList',
    });
  };

  // 搜索参数
  const propItem = {
    title: `领豆明细 - ${ownerName}`,
    dispatchType: 'shareManage/fetchShareGetBeanDetail',
    rowKey: 'beanDetailNewId',
    searchItems: [
      {
        label: '领豆时间',
        type: 'rangePicker',
        name: 'createTimeStart',
        end: 'createTimeEnd',
      },
      {
        label: '领豆用户',
        name: 'userId',
        type: 'user',
      },
    ],
    getColumns: [
      {
        title: '领豆用户',
        align: 'center',
        dataIndex: 'userName',
      },
      {
        title: '用户手机号',
        align: 'center',
        dataIndex: 'userMobile',
        render: (val) => val || '暂未授权',
      },
      {
        title: '用户豆号',
        align: 'center',
        dataIndex: 'userBeanCode',
      },
      {
        title: '领取卡豆数（个）',
        align: 'right',
        dataIndex: 'beanAmount',
      },
      {
        title: '领豆时间',
        align: 'center',
        dataIndex: 'createTime',
      },
    ],
  };

  const tableProps = {
    noCard: false,
    loading,
    columns: propItem.getColumns,
    searchItems: propItem.searchItems,
    dispatchType: propItem.dispatchType,
    size: 'middle',
    params: { userMomentIdString },
    ...beanDetal,
  };

  return (
    <Modal
      title={propItem.title}
      width={1200}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={onClose}
      afterClose={fetchCloseModal}
    >
      <TableDataBlock order {...tableProps} rowKey={(row) => `${row[propItem.rowKey]}`} />
    </Modal>
  );
};

export default connect(({ shareManage, baseData, loading }) => ({
  beanDetal: shareManage.beanDetal,
  userList: baseData.userList,
  loading: loading.effects['shareManage/fetchShareGetBeanDetail'],
}))(VideoPeasDetail);
