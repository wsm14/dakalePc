import moment from 'moment';
import { ADD_AND_MINUS, SUBSIDY_TASK_ROLE } from '@/common/constant';
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
      dataIndex: 'gainTime',
    },
    {
      title: '平台直充',
      align: 'right',
      dataIndex: 'platformBean',
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
  const monthColums = [
    {
      title: '时间',
      align: 'center',
      dataIndex: 'gainTime',
    },

    {
      title: '补贴店铺',
      align: 'right',
      dataIndex: 'platformBean',
    },

    {
      title: '【总】补贴（卡豆',
      align: 'right',
      dataIndex: 'inBean',
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
          title: '类型',
          align: 'center',
          dataIndex: 'identificationType',
          render: (val) => (val === 'platform' ? '平台直充' : '--'),
        },
        {
          title: '角色',
          align: 'center',
          dataIndex: 'subsidyRole',
          render: (val) => SUBSIDY_TASK_ROLE[val],
        },
        {
          title: '任务名称',
          align: 'center',
          dataIndex: 'taskName',
        },
        {
          title: '卡豆',
          align: 'center',
          dataIndex: 'bean',
        },

        {
          title: '操作',
          align: 'center',
          dataIndex: 'time',
          render: (val, row) => infoHandle(() => fetchGetDetail(row.type, row)),
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
