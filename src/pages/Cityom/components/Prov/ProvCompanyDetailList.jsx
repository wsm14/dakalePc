import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import DataTableBlock from '@/components/DataTableBlock';
import ProvCompanyTotalInfo from './IncomeTotal';

const ProvCompanyDetailList = (props) => {
  const { detailList, loading, visible, setVisible } = props;

  const { type = 'withdraw', record = '' } = visible;

  // table
  const propItem = {
    withdraw: {
      title: `提现明细`,
      rowKey: '',
      searchItems: [
        {
          label: '提现日期',
          type: 'datePicker',
          name: 'userMobile1s',
        },
        {
          type: 'datePicker',
          label: '到账日期',
          name: 'userMosbile1s',
        },
        {
          label: '提现状态',
          name: 'userMo',
          type: 'select',
          select: { list: [] },
        },
      ],
      getColumns: [
        {
          title: '提现日期',
          align: 'center',
          dataIndex: 'userId',
        },
        {
          title: '提现单号',
          align: 'center',
          dataIndex: 'username',
        },
        {
          title: '订单流水',
          align: 'center',
          dataIndex: 'status',
        },
        {
          title: '提现卡豆',
          align: 'center',
          dataIndex: 'earnBeanAmount',
        },
        {
          title: '提现到',
          align: 'center',
          dataIndex: 'signDate',
        },
        {
          title: '提现状态',
          align: 'center',
          dataIndex: 'process',
        },
        {
          title: '到账日期',
          align: 'center',
          dataIndex: 'process',
        },
      ],
    },
    income: {
      title: `收益数据`,
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
      {
        {
          withdraw: (
            <DataTableBlock
              CardNone={false}
              loading={loading}
              searchItems={propItem.searchItems}
              columns={propItem.getColumns}
              rowKey={(row) => `${row[propItem.rowKey]}`}
              dispatchType="provCompany/fetchWithdrawList"
              componentSize="middle"
              {...detailList}
            ></DataTableBlock>
          ),
          income: <ProvCompanyTotalInfo></ProvCompanyTotalInfo>,
        }[type]
      }
    </Modal>
  );
};

export default connect(({ provCompany, loading }) => ({
  detailList: provCompany.detailList,
  loading: loading.models.provCompany,
}))(ProvCompanyDetailList);
