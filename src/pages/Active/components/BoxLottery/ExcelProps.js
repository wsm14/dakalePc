import { checkCityName, getCityName } from '@/utils/utils';
import { BOXLOTTERY_TYPE, BOXLOTTERY_STATUS } from '@/common/constant';
// 导出列表
export default {
  // fieldNames: { key: 'key', headerName: 'header' },
  header: [
    {
      title: '中奖记录编号',
      dataIndex: 'blindBoxRewardId',
    },
    {
      title: '用户昵称',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '用户手机号',
      dataIndex: 'mobile',
    },
    {
      title: '用户豆号',
      dataIndex: 'beanCode',
    },
    {
      title: '用户所属地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '抽奖时间',
      dataIndex: 'createTime',
    },
    {
      title: '抽奖场次',
      dataIndex: 'luckDrawType',
      render: (val) => BOXLOTTERY_TYPE[val],
    },
    {
      title: '消耗卡豆数',
      dataIndex: 'consumeNum',
      render: (val, row) => (row.luckDrawType === 'bean' ? val : '--'),
    },
    {
      title: '抽奖结果',
      dataIndex: 'showName',
    },
    {
      title: '奖品ID',
      dataIndex: 'awardId',
    },
    {
      title: '发放状态',
      // fixed: 'right',
      dataIndex: 'logisticsStatus',
      render: (val, row) => BOXLOTTERY_STATUS[val] || '--',
    },
    {
      title: '收货人姓名',
      dataIndex: 'contentParam',
      render: (val) => ((val && JSON.parse(val.replace(//g, ''))) || {})?.addressName,
    },
    {
      title: '收货人手机号',
      dataIndex: 'contentParam',
      render: (val) => ((val && JSON.parse(val.replace(//g, ''))) || {})?.mobile,
    },
    {
      title: '收货地址（省）',
      dataIndex: 'contentParam',
      render: (val) =>
        getCityName(((val && JSON.parse(val.replace(//g, ''))) || {})?.provinceCode),
    },
    {
      title: '收货地址（市)',
      dataIndex: 'contentParam',
      render: (val) => getCityName(((val && JSON.parse(val.replace(//g, ''))) || {})?.cityCode),
    },
    {
      title: '收货地址（区/县）',
      dataIndex: 'contentParam',
      render: (val) =>
        getCityName(((val && JSON.parse(val.replace(//g, ''))) || {})?.districtCode),
    },
    {
      title: '收货地址（详细地址）',
      dataIndex: 'contentParam',
      render: (val) => ((val && JSON.parse(val.replace(//g, ''))) || {})?.address,
    },
  ],
};
