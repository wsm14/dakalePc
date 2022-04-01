import { checkCityName, getCityName } from '@/utils/utils';
import { GAME_FREE_STATUS, GAME_SIGN_PACKAGE_TYPE } from '@/common/constant';
// 导出列表
export default {
  // fieldNames: { key: 'key', headerName: 'header' },
  header: [
    {
      title: '游戏名称',
      dataIndex: 'channel',
    },
    {
      title: '中奖编号',
      dataIndex: 'userPackageId',
    },
    {
      title: '用户昵称',
      dataIndex: 'username',
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
      title: '中奖时间',
      dataIndex: 'createTime',
    },
    {
      title: '中奖结果',
      dataIndex: 'packageName',
    },
    {
      title: '发放状态',
      dataIndex: 'status',
      render: (val, row) => GAME_FREE_STATUS[val],
    },
    {
      title: '发货时间',
      dataIndex: 'deliveryTime',
    },
    {
      title: '收货人姓名',
      dataIndex: 'userAddressObject',
      render: (val) => val?.addressName,
    },
    {
      title: '收货人手机号',
      dataIndex: 'userAddressObject',
      render: (val) => val?.mobile,
    },
    {
      title: '收货地址（省）',
      dataIndex: 'userAddressObject',
      render: (val) => getCityName(val?.provinceCode),
    },
    {
      title: '收货地址（市)',
      dataIndex: 'userAddressObject',
      render: (val) => getCityName(val?.cityCode),
    },
    {
      title: '收货地址（区/县）',
      dataIndex: 'userAddressObject',
      render: (val) => getCityName(val?.districtCode),
    },
    {
      title: '收货地址（详细地址）',
      dataIndex: 'userAddressObject',
      render: (val) => val?.address,
    },
  ],
};
