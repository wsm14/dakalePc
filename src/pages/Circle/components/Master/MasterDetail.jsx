import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { MATCH_USER_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import DataTableBlock from '@/components/DataTableBlock';
import MasterOrderDetail from './MasterOrderDetail';

const MasterDetail = (props) => {
  const { circleMaster, loading, visible, setVisible } = props;

  const { type = 'family', record = '' } = visible;

  // table
  const propItem = {
    family: {
      title: `家人明显 - 家主ID：0001 用户/商户名：小王 累计邀请家人：1200人`,
      getColumns: [
        {
          title: '用户ID',
          align: 'center',
          dataIndex: 'userId',
        },
        {
          title: '昵称',
          align: 'center',
          dataIndex: 'username',
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'status',
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'earnBeanAmount',
          render: (val) => MATCH_USER_STATUS[val],
        },
        {
          title: '坐标',
          align: 'center',
          dataIndex: 'signDate',
        },
        {
          title: '注册时间',
          align: 'center',
          dataIndex: 'process',
          render: (val) => val || '--',
        },
      ],
    },
    shop: {
      title: `家主明显 - 家主ID：0001 用户/商户名：小王的店 累计邀请家店：1200家`,
      getColumns: [
        {
          title: '商户ID',
          align: 'center',
          dataIndex: 'userId',
        },
        {
          title: '商家名称',
          align: 'center',
          dataIndex: 'username',
        },
        {
          title: '商家账号',
          align: 'center',
          dataIndex: 'status',
        },
        {
          title: '商家类型',
          align: 'center',
          dataIndex: 'earnBeanAmount',
          render: (val) => MATCH_USER_STATUS[val],
        },
        {
          title: '所在城市',
          align: 'center',
          dataIndex: 'signDate',
        },
        {
          title: '详细地址',
          align: 'center',
          dataIndex: 'process',
          render: (val) => (
            <Ellipsis length={10} tooltip>
              {val || '-'}
            </Ellipsis>
          ),
        },
        {
          title: '入驻时间',
          align: 'center',
          dataIndex: 'processs',
        },
      ],
    },
    income: {
      title: `收益明细 - 家主ID：0001 用户/商户名：小王 累计收益：1200卡豆`,
      getColumns: [
        {
          title: '日期',
          align: 'center',
          dataIndex: 'userId',
        },
        {
          title: '事件',
          align: 'center',
          dataIndex: 'username',
        },
        {
          title: '卡豆明细',
          align: 'center',
          dataIndex: 'status',
        },
        {
          title: '关联用户',
          align: 'center',
          dataIndex: 'earnBeanAmount',
          render: (val) => val || '--',
        },
        {
          title: '关联商户',
          align: 'center',
          dataIndex: 'signDate',
          render: (val) => val || '--',
        },
        {
          title: '关联订单',
          align: 'center',
          dataIndex: 'order',
          render: (val, record) => <MasterOrderDetail order={val} />,
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
        CardNone={false}
        loading={loading}
        columns={propItem.getColumns}
        rowKey={(row) => `${row[propItem.rowKey]}`}
        params={{ type }}
        dispatchType="circleMaster/fetchDetailList"
        componentSize="middle"
        {...circleMaster.detailList}
      ></DataTableBlock>
    </Modal>
  );
};

export default connect(({ circleMaster, loading }) => ({
  circleMaster,
  loading: loading.effects['circleMaster/fetchDetailList'],
}))(MasterDetail);
