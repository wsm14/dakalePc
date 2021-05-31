import moment from 'moment';
import { PLATFORM_INCOME_ORDERS_TYPE } from '@/common/constant';

const infoHandle = (click) =>[
  {
    type: 'info',
    auth: true,
    click,
  },
]

/**
 * 表格头
 * @param {*} type order - 按单显示 day - 按日显示 month - 按月显示
 */
const tableColums = ({ type, searchData, setSearchData, fetchGetDetail }) => {
  // 按日显示 按月显示 表格头
  const dayMonthColums = [
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
      title: '核销收益',
      align: 'right',
      dataIndex: 'writeOffBean',
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
      dataIndex: 'bean',
    },
  ];

  switch (type) {
    // 按单显示
    case 'order':
      return [
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
          type:"handle",
          dataIndex: 'identification',
          render: (val, row) => infoHandle(() => fetchGetDetail(val, row.type, row.bean)),
        },
      ];
    // 按日显示
    case 'day':
      return [
        ...dayMonthColums,
        {
          title: '详情',
          type:"handle",
          dataIndex: 'remark',
          render: (val, row) =>
            infoHandle(() =>
              setSearchData({
                ...searchData,
                latitude: 'order',
                time: [moment(row.time).startOf('day'), moment(row.time).endOf('day')],
              }),
            ),
        },
      ];
    default:
      // 按月显示
      return [
        ...dayMonthColums,
        {
          title: '详情',
          type:"handle",
          dataIndex: 'remark',
          render: (val, row) =>
            infoHandle(() =>
              setSearchData({
                ...searchData,
                latitude: 'day',
                time: [moment(row.time).startOf('month'), moment(row.time).endOf('month')],
              }),
            ),
        },
      ];
  }
};

export default tableColums;
