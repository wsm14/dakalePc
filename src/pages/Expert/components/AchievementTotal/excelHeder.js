import { checkCityName } from '@/utils/utils';
import { DAREN_TEMP_FLAG } from '@/common/constant';
// 导出表头
export default (kolLevel) => [
  {
    title: '哒人ID',
    dataIndex: 'userIdString',
  },
  {
    title: '哒人昵称/ID',
    dataIndex: 'username',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    title: '豆号',
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
    title: '新增家人数',
    align: 'center',
    dataIndex: 'familyCount',
  },
  {
    title: '新增直培哒人',
    align: 'center',
    dataIndex: 'familyDarenCount',
  },
  {
    title: '分销-核销笔数',
    align: 'center',
    dataIndex: 'statisticOrderCount',
  },
  {
    title: '分销-业绩流水',
    align: 'center',
    dataIndex: 'statisticTotalFee',
    render: (val, row) => `¥ ${val ? val : '0'}`,
  },
];
