import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { WITHDRAW_STATUS } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';
import CityPartnerTotalInfo from './IncomeTotal';

const CityPartnerDetailList = (props) => {
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
          name: 'withdrawalDate',
        },
        {
          type: 'datePicker',
          label: '到账日期',
          name: 'finishTime',
        },
        {
          label: '提现状态',
          type: 'select',
          name: 'withdrawStatus',
          select: { list: WITHDRAW_STATUS },
        },
      ],
      getColumns: [
        {
          title: '提现日期',
          align: 'center',
          dataIndex: 'createTime',
        },
        {
          title: '提现单号',
          align: 'center',
          dataIndex: 'withdrawalSn',
        },
        {
          title: '订单流水',
          align: 'center',
          dataIndex: 'incomeSn',
        },
        {
          title: '提现卡豆',
          align: 'center',
          dataIndex: 'withdrawalBeanAmount',
        },
        {
          title: '提现到',
          align: 'center',
          dataIndex: 'withdrawalChannelName',
        },
        {
          title: '提现状态',
          align: 'center',
          dataIndex: 'status',
          render: (val) => WITHDRAW_STATUS[val],
        },
        {
          title: '到账日期',
          align: 'center',
          dataIndex: 'finishTime',
          render: (val) => (val ? val : '--'),
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
              params={{ partnerId: record.partnerIdString }}
              dispatchType="cityPartner/fetchCityWithdrawDetail"
              componentSize="middle"
              {...detailList}
            ></DataTableBlock>
          ),
          income: <CityPartnerTotalInfo record={record}></CityPartnerTotalInfo>,
        }[type]
      }
    </Modal>
  );
};

export default connect(({ cityPartner, loading }) => ({
  detailList: cityPartner.detailList,
  loading: loading.models.cityPartner,
}))(CityPartnerDetailList);
