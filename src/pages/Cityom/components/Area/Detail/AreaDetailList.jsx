import React from 'react';
import { Modal } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import ProvCompanyTotalInfo from './IncomeTotal';

const ProvCompanyDetailList = (props) => {
  const { loading, visible, setVisible } = props;

  const { type = 'withdraw', record = '' } = visible;

  // table
  const propItem = {
    withdraw: {
      title: `提现明细 - ${record.partnerName}`,
      rowKey: '',
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
      title: `收益数据 - ${record.partnerName}`,
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
            <TableDataBlock
              noCard={false}
              loading={loading}
              columns={propItem.getColumns}
              rowKey={(row) => `${row[propItem.rowKey]}`}
              dispatchType="areaCenter/fetchWithdrawList"
              size="middle"
              list={[]}
            ></TableDataBlock>
          ),
          income: <ProvCompanyTotalInfo partnerId={record.partnerId}></ProvCompanyTotalInfo>,
        }[type]
      }
    </Modal>
  );
};

export default ProvCompanyDetailList;
