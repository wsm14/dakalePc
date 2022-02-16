import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { checkCityName } from '@/utils/utils';
import { SUBSIDY_BEAN_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const TaskDetailList = (props) => {
  const { detailList, loading, visible = {}, onClose } = props;

  const { show = false, detail = {} } = visible;
  const { subsidyId, taskName, role = 'user', mode } = detail;

  const tableProps = {
    user: {
      api: 'subsidyManage/fetchSubsidyTaskDetailList',
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
          dataIndex: 'username',
        },
        {
          title: '用户手机号',
          dataIndex: 'mobile',
        },
        {
          title: '豆号',
          align: 'center',
          dataIndex: 'beanCode',
        },
        {
          title: '级别',
          dataIndex: 'levelName',
        },
        {
          title: '注册地',
          dataIndex: 'districtCode',
          render: (val) => checkCityName(val) || '--',
        },
        {
          title: `${SUBSIDY_BEAN_TYPE[mode]}卡豆数`,
          align: 'right',
          dataIndex: 'subsidyBean',
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
          dataIndex: 'mobile',
        },
        {
          title: '所属商圈',
          dataIndex: 'businessHub',
        },
        {
          title: '所属行业',
          align: 'center',
          dataIndex: 'topCategoryName',
        },
        {
          title: '地址',
          dataIndex: 'address',
        },
        {
          title: `${SUBSIDY_BEAN_TYPE[mode]}卡豆数`,
          align: 'right',
          dataIndex: 'subsidyBean',
        },
      ],
    },
    group: {
      api: 'subsidyManage/fetchSubsidyTaskDetailList',
      searchItems: [
        {
          label: '集团名称',
          name: 'merchantName',
        },
      ],
      getColumns: [
        {
          title: '集团名称',
          dataIndex: 'groupName',
          ellipsis: true,
        },
        {
          title: '经营类目',
          dataIndex: 'topCategoryName',
          render: (val, row) => `${val}-${row.categoryName}`,
        },
        {
          title: '地区',
          dataIndex: 'districtCode',
          render: (val) => checkCityName(val) || '--',
        },
        {
          title: '详细地址',
          dataIndex: 'address',
          ellipsis: true,
        },
        {
          title: `${SUBSIDY_BEAN_TYPE[mode]}卡豆数`,
          align: 'right',
          dataIndex: 'subsidyBean',
        },
      ],
    },
  }[role];

  return (
    <Modal
      title={`补贴详情 - ${taskName} | 总${SUBSIDY_BEAN_TYPE[mode]}卡豆：${detailList.totalBeans}`}
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
        params={{ subsidyId, role }}
        dispatchType={tableProps.api}
        size="middle"
        {...detailList}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ subsidyManage, loading }) => ({
  detailList: subsidyManage.detailList,
  loading: loading.effects['subsidyManage/fetchSubsidyTaskDetailList'],
}))(TaskDetailList);
