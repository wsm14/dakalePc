import { checkCityName } from '@/utils/utils';
import { WITHDRAW_STATUS, WITHDRAW_ALLIANCE_TYPE } from '@/common/constant';
// 导出列表
export default {
  // fieldNames: { key: 'key', headerName: 'header' },
  header: [
    {
      title: '提现日期',
      fixed: 'left',
      dataIndex: 'withdrawalDate',
    },
    {
      title: '平台类型',
      dataIndex: 'userType',
      render: (val) => WITHDRAW_ALLIANCE_TYPE[val],
    },
    {
      title: '企业名称',
      dataIndex: 'subjectName',
    },
    {
      title: '省市区',
      dataIndex: 'districtCode',
      render: (val, row) => checkCityName(val || row.cityCode || row.provinceCode),
    },
    {
      title: '提现账户',
      align: 'center',
      dataIndex: 'withdrawalAccount',
      render: (val, row) => `${row.withdrawalChannelName}\n${val}`,
    },
    {
      title: '提现账户类型',
      align: 'center',
      dataIndex: 'withdrawalChannelType',
      render: (val) => '现金账户',
    },
    {
      title: '提现金额',
      align: 'right',
      dataIndex: 'withdrawalBeanAmount',
      render: (val) => val / 100,
    },
    {
      title: '实收提现手续费',
      align: 'right',
      dataIndex: 'withdrawalHandlingFee',
      render: (val) => `￥ ${val}`,
    },
    {
      title: '状态',
      align: 'right',
      fixed: 'right',
      dataIndex: 'status',
      render: (val) => WITHDRAW_STATUS[val],
    },
  ],
};
