import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const BDSet = (props) => {
  const { visible = {}, onClose, dispatch, accountList, loading } = props;

  const { show = '', detail = {} } = visible;

  const [form] = Form.useForm();

  // 获取用户列表
  const getUserList = () => {
    dispatch({
      type: 'accountList/fetchGetList',
      payload: {
        page: 1,
        limit: 999,
      },
    });
  };

  // 提交表单
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      onClose();
    });
  };

  const formItems = [
    {
      label: '选择BD',
      loading,
      name: 'adminAccountId',
      type: 'select',
      select: accountList,
      fieldNames: { label: 'adminName', value: 'adminAccountId' },
    },
  ];

  const modalProps = {
    title: `关联BD - ${detail.username}`,
    visible: show,
    onClose,
    afterCallBack: () => {
      getUserList();
    },
    footer: (
      <Button type="primary" onClick={fetchGetFormData} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ accountList, loading }) => ({
  accountList: accountList.list,
  loading: loading.models.expertUserList || loading.models.accountList,
}))(BDSet);
