import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import FormCondition from '@/components/FormCondition';

/**
 * 联系人信息 && 介绍人信息
 */
const OhterInfoForm = ({ form, dispatch, loading, initialValues }) => {
  const [userList, setUserList] = useState([]); //  用户列表
  const [anyInducer, setAnyInducer] = useState(0); // 有无介绍人 0-无 1-有

  useEffect(() => {
    setAnyInducer(initialValues.anyInducer || 0);
    initialValues?.inducer && fetchGetUser(initialValues?.inducer?.inducerName);
  }, [initialValues]);

  // 获取用户搜索
  const fetchGetUser = debounce((content) => {
    if (!content) return;
    dispatch({
      type: 'baseData/fetchGetUsersSearch',
      payload: {
        content,
      },
      callback: (useList) => {
        const list = useList
          .map((item) => ({
            ...item,
            value: item.userIdString,
            name: item.username + '-' + item.mobile + '-' + item.beanCode,
          }))
          .splice(0, 100);
        setUserList(list);
      },
    });
  }, 500);

  const formItems = [
    {
      title: '02 联系人信息',
      label: '联系人姓名',
      name: 'contactName',
    },
    {
      label: '联系人手机号',
      name: 'contactPhone',
    },
    {
      title: '03 介绍人信息',
      label: '有无介绍人',
      name: 'anyInducer',
      type: 'radio',
      select: ['无', '有'],
      onChange: (e) => setAnyInducer(e.target.value),
    },
    {
      label: '介绍人账号',
      name: 'inducerId',
      type: 'select',
      placeholder: '请输入昵称、手机号或豆号',
      loading: loading.effects['baseData/fetchGetUsersSearch'],
      onSearch: fetchGetUser,
      select: userList,
      visible: anyInducer == 1,
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ loading }) => ({
  loading,
}))(OhterInfoForm);
