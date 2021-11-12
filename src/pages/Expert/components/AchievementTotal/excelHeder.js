import { checkCityName } from '@/utils/utils';
import { DAREN_TEMP_FLAG } from '@/common/constant';
// 导出表头
export default (kolLevel) => [
  {
    title: '哒人ID',
    dataIndex: 'userIdString',
  },
  {
    title: '哒人昵称',
    dataIndex: 'username',
  },
  {
    title: '哒人手机号',
    dataIndex: 'mobile',
  },
  {
    title: '哒人豆号',
    dataIndex: 'beanCode',
  },
  {
    title: '级别',
    align: 'center',
    dataIndex: 'level',
    render: (val) => {
      let name = '';
      kolLevel?.forEach((item) => {
        if (item.value == val) {
          name = item.name;
        }
      });
      return name;
    },
  },
  {
    title: '是否实习',
    align: 'center',
    dataIndex: 'tempLevelFlag',
    render: (val) => DAREN_TEMP_FLAG[val],
  },
  {
    title: '注册地',
    align: 'center',
    dataIndex: 'districtCode',
    render: (val) => checkCityName(val),
  },
  {
    title: '团购销售额',
    align: 'center',
    dataIndex: 'communitySaleVolume',
  },
  {
    title: '团购订单数',
    align: 'center',
    dataIndex: 'communityOrderNum',
  },
  {
    title: '关联BD',
    align: 'center',
    dataIndex: 'sellName',
  },
  {
    title: 'BD手机号',
    align: 'center',
    dataIndex: 'sellMobile',
  },
];
