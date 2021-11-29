import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import { ADD_AND_MINUS, SUBSIDY_TASK_ROLE, SUBSIDY_TYPE } from '@/common/constant';

const infoHandle = (click) => [
  {
    type: 'info',
    auth: true,
    click,
  },
];

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
      dataIndex: 'gainTime',
    },
    // {
    //   title: '营销卡豆充值',
    //   align: 'right',
    //   dataIndex: 'platformBean',
    // },
    {
      title: '收入（卡豆）',
      align: 'right',
      dataIndex: 'inBean',
    },
    {
      title: '支出（卡豆）',
      align: 'right',
      dataIndex: 'outBean',
    },
  ];
  const monthColums = [
    {
      title: '时间',
      align: 'center',
      dataIndex: 'gainMonth',
    },
    {
      title: '收入（卡豆）',
      align: 'right',
      dataIndex: 'inBean',
    },
    {
      title: '支出（卡豆）',
      align: 'right',
      dataIndex: 'outBean',
    },
  ];

  switch (type) {
    // 按单显示
    case 'order':
      return [
        {
          title: '时间',
          align: 'center',
          dataIndex: 'gainTime',
        },
        {
          title: '收入/支出',
          align: 'center',
          dataIndex: 'detailType',
          render: (val) => ADD_AND_MINUS[val],
        },
        {
          title: '卡豆类型',
          align: 'center',
          dataIndex: 'identificationType',
          render: (val) => SUBSIDY_TYPE[val],
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'detailType',
          render: (val) => (val == 'minus' ? '补贴' : '回收'),
        },
        {
          title: '角色',
          align: 'center',
          dataIndex: 'subsidyRole',
          render: (val) => SUBSIDY_TASK_ROLE[val],
        },
        // {
        //   title: '店铺名称',
        //   align: 'center',
        //   dataIndex: 'merchantName',
        // },
        {
          title: '任务名称',
          align: 'center',
          dataIndex: 'taskName',
          render: (val) => (
            <Ellipsis tooltip length={10}>
              {val}
            </Ellipsis>
          ),
        },
        {
          title: '卡豆',
          align: 'right',
          dataIndex: 'bean',
        },
        {
          type: 'handle',
          dataIndex: 'time',
          render: (val, row) => infoHandle(() => fetchGetDetail(row.subsidyRole, row)),
        },
      ];
    // 按日显示
    case 'day':
      return [
        ...dayColums,
        {
          dataIndex: 'remark',
          type: 'handle',
          render: (val, row) =>
            infoHandle(() =>
              setSearchData({
                ...searchData,
                latitude: 'order',
                time: [moment(row.gainTime).startOf('day'), moment(row.gainTime).endOf('day')],
              }),
            ),
        },
      ];
    default:
      // 按月显示
      return [
        ...monthColums,
        {
          type: 'handle',
          dataIndex: 'remark',
          render: (val, row) =>
            infoHandle(() =>
              setSearchData({
                ...searchData,
                latitude: 'day',
                time: [
                  moment(row.gainMonth).startOf('month'),
                  moment(row.gainMonth).endOf('month'),
                ],
              }),
            ),
        },
      ];
  }
};

export default tableColums;
