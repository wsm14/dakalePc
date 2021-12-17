import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Modal } from 'antd';
import debounce from 'lodash/debounce';
import FormCondition from '@/components/FormCondition';

const RemainModal = (props) => {
  const { visible = {}, onClose, dispatch, loading } = props;
  const { show = false, prizeData = {} } = visible;

  const [form] = Form.useForm();
  const [userList, setUserList] = useState(false);

  // 获取用户搜索
  const fetchGetUser = debounce((content) => {
    if (!content) return;
    dispatch({
      type: 'baseData/fetchGetUsersSearch',
      payload: {
        content,
      },
      callback: (useList) => {
        const list = useList.map((item) => ({
          ...item,
          tipInfo: `${item.mobile} ${item.beanCode}`,
        }));
        setUserList(list);
      },
    });
  }, 500);

  const handleOk = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'platformEquity/fetchGiveGoods',
        payload: {
          ownerId: -1,
          ...prizeData, // 赠送数据
          ...values,
        },
        callback: () => {
          onClose();
        },
      });
    });
  };

  const formItems = [
    {
      label: `选择用户`,
      name: 'userId',
      placeholder: '请输入昵称、手机号或豆号',
      type: 'select',
      loading,
      select: userList,
      onSearch: fetchGetUser,
      fieldNames: { label: 'username', value: 'userIdString', tip: 'tipInfo' },
    },
  ];

  const modalProps = {
    title: `赠送 - ${prizeData.goodsName}`,
    visible: show,
    onCancel: onClose,
    onOk: handleOk,
  };
  return (
    <Modal destroyOnClose {...modalProps} loading={loading}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </Modal>
  );
};
export default connect(({ loading }) => ({
  loading:
    loading.effects['baseData/fetchGetUsersSearch'] ||
    loading.effects['platformEquity/fetchGiveGoods'],
}))(RemainModal);
