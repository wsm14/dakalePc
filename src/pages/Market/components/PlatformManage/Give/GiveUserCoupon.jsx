import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Modal, Button, Typography } from 'antd';
import debounce from 'lodash/debounce';
import ImportDataModal from './ImportDataModal';
import FormCondition from '@/components/FormCondition';

const GiveUserCoupon = (props) => {
  const { visible = {}, onClose, dispatch, loading } = props;
  const { show = false, detail = {} } = visible;
  console.log(detail, 'detail');
  const [form] = Form.useForm();
  const [userList, setUserList] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
          name: `${item.username} ${item.mobile}`,
          value: item.userIdString,
          otherData: `${item.beanCode}`,
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
          ...detail, // 赠送数据
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
      placeholder: '请输入昵称、手机号',
      type: 'select',
      loading,
      select: userList,
      onSearch: fetchGetUser,
    },
  ];

  const modalProps = {
    title: `赠送 - ${detail.couponName}`,
    visible: show,
    footer: [
      <Typography.Link
        style={{ float: 'left', marginTop: 5 }}
        onClick={() => {
          setModalVisible({ show: true });
        }}
      >
        批量赠送
      </Typography.Link>,
      <Button key="cancle" loading={loading} onClick={onClose}>
        取消
      </Button>,
      <Button key="ok" type="primary" loading={loading} onClick={handleOk}>
        确定
      </Button>,
    ],
    onCancel: onClose,
  };
  return (
    <>
      <Modal destroyOnClose {...modalProps} loading={loading}>
        <FormCondition form={form} formItems={formItems}></FormCondition>
      </Modal>
      <ImportDataModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
      ></ImportDataModal>
    </>
  );
};
export default connect(({ loading }) => ({
  loading:
    loading.effects['baseData/fetchGetUsersSearch'] ||
    loading.effects['platformEquity/fetchGiveGoods'],
}))(GiveUserCoupon);
