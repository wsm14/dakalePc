import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import DataTableBlock from '@/components/DataTableBlock';
import MasterOrderDetail from './MasterOrderDetail';

const MasterDetail = (props) => {
  const { detailList, loading, visible, setVisible } = props;

  const { type = 'family', record = '' } = visible;

  // table
  const propItem = {
    family: {
      title: `家人明细 - 家主ID：${record.id} 用户/店铺名：${record.name} 累计邀请家人：${record.totalFamilyUser}人`,
      rowKey: 'userIdString',
      getColumns: [
        {
          title: '用户ID',
          align: 'center',
          dataIndex: 'userIdString',
        },
        {
          title: '昵称',
          align: 'center',
          dataIndex: 'username',
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'mobile',
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'gender',
          render: (val) => ({ M: '男', F: '女', '': '--' }[val]),
        },
        {
          title: '坐标',
          align: 'center',
          dataIndex: 'residentAddress',
        },
        {
          title: '注册时间',
          align: 'center',
          dataIndex: 'createTime',
        },
      ],
    },
    shop: {
      title: `家店明细 - 家主ID：${record.id} 用户/店铺名：${record.name} 累计邀请家店：${record.totalFamilyMerchant}家`,
      rowKey: 'userMerchantIdString',
      getColumns: [
        {
          title: '店铺ID',
          align: 'center',
          dataIndex: 'userMerchantIdString',
        },
        {
          title: '店铺名称',
          align: 'center',
          dataIndex: 'merchantName',
        },
        {
          title: '店铺账号',
          align: 'center',
          dataIndex: 'account',
        },
        {
          title: '商家类型',
          align: 'center',
          dataIndex: 'topCategoryName',
        },
        {
          title: '所在城市',
          align: 'center',
          dataIndex: 'cityName',
        },
        {
          title: '详细地址',
          align: 'center',
          dataIndex: 'address',
          render: (val) => (
            <Ellipsis length={10} tooltip>
              {val || '-'}
            </Ellipsis>
          ),
        },
        {
          title: '入驻时间',
          align: 'center',
          dataIndex: 'createTime',
        },
      ],
    },
    income: {
      title: `收益明细 - 家主ID：${record.id} 用户/店铺名：${record.name} 累计收益：${record.totalAdd}卡豆`,
      rowKey: 'createTime',
      getColumns: [
        {
          title: '日期',
          align: 'center',
          dataIndex: 'createTime',
        },
        {
          title: '事件',
          align: 'center',
          dataIndex: 'detailTitle',
        },
        {
          title: '卡豆明细',
          align: 'center',
          dataIndex: 'beanAmount',
        },
        {
          title: '关联用户',
          align: 'center',
          dataIndex: 'relatedUser',
          render: (val) => (record.userType == 'user' ? record.username : val || '--'),
        },
        {
          title: '关联店铺',
          align: 'center',
          dataIndex: 'relatedMerchant',
          render: (val) => (record.userType !== 'user' ? record.username : val || '--'),
        },
        {
          title: '关联订单',
          align: 'center',
          dataIndex: 'detailOrder',
          render: (val) => <MasterOrderDetail order={val} />,
        },
      ],
    },
  }[type];

  return (
    <Modal
      title={propItem.title}
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible('')}
    >
      <DataTableBlock
        noCard={false}
        loading={loading}
        columns={propItem.getColumns}
        rowKey={(row) => `${row[propItem.rowKey]}`}
        params={{
          type,
          userType: record.userType,
          [{ family: 'ownerId', shop: 'ownerId', income: 'identifyId' }[type]]: record.id,
        }}
        dispatchType="circleMaster/fetchDetailList"
        componentSize="middle"
        {...detailList}
      ></DataTableBlock>
    </Modal>
  );
};

export default connect(({ circleMaster, loading }) => ({
  detailList: circleMaster.detailList,
  loading: loading.effects['circleMaster/fetchDetailList'],
}))(MasterDetail);
