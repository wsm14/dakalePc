import { checkCityName } from '@/utils/utils';
import { FOLLOW_TYPE, FOLLOW_MANNER, SHARE_SEX_TYPE } from '@/common/constant';

// 导出列表
export default {
  // fieldNames: { key: 'key', headerName: 'header' },
  header: [
    {
      title: '用户昵称',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '注册手机号',
      dataIndex: 'mobile',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (val) => SHARE_SEX_TYPE[val],
    },
    {
      title: '地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
    },
    {
      title: '最后行为时间',
      dataIndex: 'finalActTime',
    },
    {
      title: '跟进方式',
      dataIndex: 'manner',
      render: (val) => FOLLOW_MANNER[val],
    },
    {
      title: '跟进类型',
      dataIndex: 'type',
      render: (val) => FOLLOW_TYPE[val],
    },
    {
      title: '跟进内容',
      dataIndex: 'content',
    },
    {
      title: '跟进标签',
      dataIndex: 'tags',
    },
    {
      title: '跟进结果',
      dataIndex: 'result',
    },
    {
      title: '跟进人',
      dataIndex: 'follower',
    },
    {
      title: '跟进时间',
      dataIndex: 'followTime',
    },
  ],
};
