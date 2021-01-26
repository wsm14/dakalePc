import { PLATFORM_INCOME_ORDERS_TYPE } from '@/common/constant';
import IncomeOrderDetail from '../Detail/IncomeOrderDetail';
import HandleSetTable from '@/components/HandleSetTable';

/**
 * 表格头
 * @param {*} type order - 按单显示 day - 按日显示 month - 按月显示
 */
const tableColums = ({ type }) => {
  // 按日显示 按月显示 表格头
  const dayMonthColums = [
    {
      title: '序号',
      fixed: 'left',
      dataIndex: 'id',
      render: (val, row, index) => index + 1,
    },
    {
      title: '时间',
      align: 'center',
      dataIndex: 'time',
    },
    {
      title: '扫码支付收益',
      align: 'right',
      dataIndex: 'scanBean',
    },
    {
      title: '商品核销收益',
      align: 'right',
      dataIndex: 'goodsBean',
    },
    {
      title: '优惠券核销收益',
      align: 'right',
      dataIndex: 'couponBean',
    },
    {
      title: '看分享收益',
      align: 'right',
      dataIndex: 'merchantName',
      render: (val) => val || 0,
    },
    {
      title: '【总】收益（卡豆）',
      align: 'right',
      dataIndex: 'totalBean',
    },
  ];

  switch (type) {
    // 按单显示
    case 'order':
      return [
        {
          title: '序号',
          dataIndex: 'id',
          render: (val, row, index) => index + 1,
        },
        {
          title: '时间',
          align: 'center',
          dataIndex: 'time',
        },
        {
          title: '项目',
          align: 'center',
          dataIndex: 'type',
          render: (val) => PLATFORM_INCOME_ORDERS_TYPE[val],
        },
        {
          title: '卡豆',
          align: 'right',
          dataIndex: 'bean',
        },
        {
          title: '详情',
          align: 'right',
          dataIndex: 'identification',
          render: (val, row) => (
            <IncomeOrderDetail identification={val} type={row.type}></IncomeOrderDetail>
          ),
        },
      ];
    // 按日显示
    case 'day':
      return [
        ...dayMonthColums,
        {
          title: '详情',
          align: 'right',
          dataIndex: 'remark',
          render: (val, record) => {
            return (
              <HandleSetTable
                formItems={[
                  {
                    type: 'info',
                    click: () => {},
                  },
                ]}
              />
            );
          },
        },
      ];
    default:
      // 按月显示
      return [
        ...dayMonthColums,
        {
          title: '详情',
          align: 'right',
          dataIndex: 'remark',
          render: (val, record) => {
            return (
              <HandleSetTable
                formItems={[
                  {
                    type: 'info',
                    click: () => {},
                  },
                ]}
              />
            );
          },
        },
      ];
  }
};

export default tableColums;
