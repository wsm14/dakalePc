import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { SUBSIDY_BEAN_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const TaskDetailList = (props) => {
  const { detailList, loading, visible = {}, onClose } = props;

  const { show = false, detail = {} } = visible;
  const { subsidyId, taskName, subsidizedBeans, recycleBean, role = 'user', mode } = detail;

  const tableProps = {
    user: {
      api: 'subsidyManage/fetchSubsidyTaskUserDetailList',
      searchItems: [
        {
          label: '用户昵称',
          name: 'userName',
        },
        {
          label: '手机号',
          name: 'mobile',
        },
      ],
      getColumns: [
        {
          title: '用户ID',
          dataIndex: 'userId',
        },
        {
          title: '用户昵称',
          dataIndex: 'userName',
        },
        {
          title: '用户手机号',
          dataIndex: 'userMobile',
        },
        {
          title: '豆号',
          align: 'center',
          dataIndex: 'userBeanCode',
        },
        {
          title: '级别',
          dataIndex: 'userLevel',
        },
        {
          title: '注册地',
          dataIndex: 'provinceName',
          render: (val, row) =>
            `${val || '--'}/${row.cityName || '--'}/${row.districtName || '--'}`,
        },
        {
          title: `${SUBSIDY_BEAN_TYPE[mode]}卡豆数`,
          align: 'right',
          dataIndex: 'rechargeBeans',
        },
      ],
    },
    merchant: {
      api: 'subsidyManage/fetchSubsidyTaskDetailList',
      searchItems: [
        {
          label: '店铺名称',
          name: 'merchantName',
        },
      ],
      getColumns: [
        {
          title: '店铺名称',
          width: 200,
          dataIndex: 'merchantName',
          ellipsis: { lines: 3 },
        },
        {
          title: '店铺帐号',
          dataIndex: 'account',
        },
        {
          title: '所属商圈',
          dataIndex: 'businessHub',
        },
        {
          title: '所属行业',
          align: 'center',
          dataIndex: 'category',
        },
        {
          title: '地址',
          dataIndex: 'address',
        },
        {
          title: `${SUBSIDY_BEAN_TYPE[mode]}卡豆数`,
          align: 'right',
          dataIndex: 'rechargeBeans',
        },
      ],
    },
  }[role];

  return (
    <Modal
      title={`补贴详情 - ${taskName} | 总${SUBSIDY_BEAN_TYPE[mode]}卡豆：${
        { out: subsidizedBeans, in: recycleBean }[mode]
      }`}
      width={1150}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={onClose}
    >
      <TableDataBlock
        order
        noCard={false}
        loading={loading}
        searchItems={tableProps.searchItems}
        columns={tableProps.getColumns}
        rowKey={(row) => row.merchantId || row.userId}
        params={{ subsidyId }}
        dispatchType={tableProps.api}
        size="middle"
        {...detailList}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ subsidyManage, loading }) => ({
  detailList: subsidyManage.detailList,
  loading:
    loading.effects['subsidyManage/fetchSubsidyTaskDetailList'] ||
    loading.effects['subsidyManage/fetchSubsidyTaskUserDetailList'],
}))(TaskDetailList);
