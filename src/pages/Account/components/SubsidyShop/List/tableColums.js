import moment from 'moment';
import { PLATFORM_INCOME_ORDERS_TYPE } from '@/common/constant';
import HandleSetTable from '@/components/HandleSetTable';

const infoHandle = (click) => (
  <HandleSetTable
    formItems={[
      {
        type: 'info',
        auth: true,
        click,
      },
    ]}
  />
);

/**
 * 表格头
 * @param {*} type order - 按单显示 day - 按日显示 month - 按月显示
 */
const tableColums = ({ type, searchData, setSearchData, fetchGetDetail }) => {
 
  // 按日显示 按月显示 表格头
  const dayColums = [
    {
      title: '时间',
      align: 'center',
      dataIndex: 'time',
    },
    {
      title: '平台直充',
      align: 'right',
      dataIndex: 'scanBean',
    },
    {
      title: '内容补贴',
      align: 'right',
      dataIndex: 'goodsBean',
    },
    {
      title: '行为补贴',
      align: 'right',
      dataIndex: 'couponBean',
    },
    {
      title: '充值',
      align: 'right',
      dataIndex: 'merchantName',
      render: (val) => val || 0,
    },
    {
      title: '收入（卡豆）',
      align: 'right',
      dataIndex: 'totalBean',
    },
    {
      title: '支出（卡豆）',
      align: 'right',
      dataIndex: 'totalBean',
    },
  ];
  const monthColums = [
    {
      title: '时间',
      align: 'center',
      dataIndex: 'time',
    },
    {
      title: '平台直充',
      align: 'right',
      dataIndex: 'scanBean',
    },
    {
      title: '内容补贴',
      align: 'right',
      dataIndex: 'goodsBean',
    },
    {
      title: '行为补贴',
      align: 'right',
      dataIndex: 'couponBean',
    },
    {
      title: '充值',
      align: 'right',
      dataIndex: 'merchantName',
      render: (val) => val || 0,
    },
    {
      title: '收入（卡豆）',
      align: 'right',
      dataIndex: 'totalBean',
    },
    {
      title: '支出（卡豆）',
      align: 'right',
      dataIndex: 'totalBean',
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
          title: '收入/支出',
          align: 'center',
          dataIndex: 'time',
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'time',
        },
        {
          title: '角色',
          align: 'center',
          dataIndex: 'time',
        },
        {
          title: 'r',
          align: 'center',
          dataIndex: 'time',
        },
        {
          title: '角色',
          align: 'center',
          dataIndex: 'time',
        },
        {
          title: '角色',
          align: 'center',
          dataIndex: 'time',
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'time',
          render: (val, row) => infoHandle(() => fetchGetDetail(val, row.type, row.bean)),
        },
      ];
    // 按日显示
    case 'day':
      return [
        ...dayColums,
        {
          title: '操作',
          align: 'right',
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
        ...monthColums,
        {
          title: '操作',
          align: 'right',
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
