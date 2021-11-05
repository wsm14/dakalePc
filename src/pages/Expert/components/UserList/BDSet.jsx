import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import debounce from 'lodash/debounce';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const BDSet = (props) => {
  const { visible = {}, onClose, dispatch, loading } = props;

  const { show = '', detail = {} } = visible;

  const [form] = Form.useForm();
  const [selectList, setSelectList] = useState([]);

  // 提交表单
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'expertUserList/fetchGetBDSet',
        payload: { userId: detail.kolUserId, ...values },
        callback: onClose,
      });
    });
  };

  // 搜索
  const fetchGetSearch = debounce((content) => {
    if (!content.replace(/'/g, '')) return;
    dispatch({
      type: 'expertUserList/fetchGetBDList',
      payload: {
        sellName: content.replace(/'/g, ''),
      },
      callback: setSelectList,
    });
  }, 500);

  const formItems = [
    {
      label: '选择BD',
      loading,
      name: 'sellId',
      type: 'select',
      select: selectList,
      onSearch: fetchGetSearch,
      fieldNames: { label: 'sellName', value: 'sellId' },
    },
  ];

  const modalProps = {
    title: `关联BD - ${detail.username}`,
    visible: show,
    onClose,
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

export default connect(({ loading }) => ({
  loading: loading.models.expertUserList,
}))(BDSet);
