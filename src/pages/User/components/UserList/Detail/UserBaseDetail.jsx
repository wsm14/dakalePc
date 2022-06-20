import React from 'react';
import { Tag } from 'antd';
import { ACCOUNT_STATUS, USER_SOURCE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const UserBaseDetail = (props) => {
  const { detail = {} } = props;

  const formItems = [
    { label: '用户头像', name: 'profile', type: 'upload' },
    { label: '用户手机号', name: 'mobile' },
    { label: '豆号', name: 'beanCode' },
    { label: '用户昵称', name: 'username' },
    { label: '个性签名', name: 'introduction', render: (val) => val || '--' },
    { label: '真实姓名', name: 'realName', render: (val) => val || '无' },
    { label: '性别', name: 'gender', render: (val) => ({ M: '男', F: '女', '': '--' }[val]) },
    // { label: '身份证号', name: 'cardNumber', render: (val) => val || '无' },
    { label: '生日', name: 'birthday', render: (val) => val || '--' },
    { label: '家主手机号', name: 'parentUserMobile', render: (val) => val || '无' },
    {
      label: '注册地',
      name: 'provinceName',
      render: (val, row) =>
        val ? `${val}/${row.cityName || '--'}/${row.districtName || '--'}` : '--',
    },
    { label: '学校', name: 'school', render: (val) => val || '--' },
    { label: '学历', name: 'education', render: (val) => val || '--' },
    { label: '注册时间', name: 'createTime' },
    { label: '最后登录日期', name: 'lastLoginTime' },
    { label: '最后行为时间', name: 'finalActTime' },
    { label: '最后下单时间', name: 'lastOrderTime' },
    { label: '账号状态', name: 'status', render: (val) => ACCOUNT_STATUS[val] },
    { label: '用户来源', name: 'userSource', render: (val) => USER_SOURCE[val] },
    {
      label: '兴趣标签',
      name: 'tag',
      render: (val) =>
        val &&
        val.split(',').map((item, i) => (
          <Tag color="green" key={i}>
            {item}
          </Tag>
        )),
    },
  ];

  return (
    <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
  );
};

export default UserBaseDetail;
