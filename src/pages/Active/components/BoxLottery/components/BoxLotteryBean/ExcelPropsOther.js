import { checkCityName, getCityName } from '@/utils/utils';
import { BOXLOTTERY_TYPE } from '@/common/constant';
// 导出列表
export default {
  header: [
    {
      title: '中奖记录编号',
      dataIndex: 'prizeRecordId',
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
      dataIndex: 'distinctCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '抽奖时间',
      dataIndex: 'luckDrawTime',
    },
    {
      title: '抽奖场次',
      dataIndex: 'sceneType',
      render: (val) => BOXLOTTERY_TYPE[val],
    },
    {
      title: '消耗卡豆数',
      dataIndex: 'needBeanNums',
    },
    {
      title: '抽奖结果',
      dataIndex: 'prizeName',
    },
    {
      title: '奖品ID',
      dataIndex: 'prizeId',
    },
  ],
};
