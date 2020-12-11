import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Alert } from 'antd';
import FormCondition from '@/components/FormCondition';

const SpecialGoodsTrade = (props) => {
  const { loading, dispatch, visible = false, tradeList, onCancel } = props;
  const { show = false, detail = {} } = visible;

  const [form] = Form.useForm();

  // 勾选的行业设置
  const handleSetTradeSelect = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'baseData/fetchSetTradeSelect',
        payload: values,
        callback: onCancel,
      });
    });
  };

  const formItems = [
    {
      label: '行业类目',
      name: 'categoryIds',
      type: 'checkbox',
      select: tradeList.map((item) => ({ label: item.categoryName, value: item.categoryIdString })),
      rules: [{ required: false }],
    },
  ];

  return (
    <Modal
      title={'行业设置'}
      width={650}
      destroyOnClose
      visible={show}
      confirmLoading={loading}
      onOk={handleSetTradeSelect}
      onCancel={onCancel}
      bodyStyle={{ padding: '0 0 24px' }}
    >
      <Alert
        message="勾选之后将不会出现在周边特惠的行业tab中"
        banner
        style={{ marginBottom: 20 }}
      />
      <FormCondition formItems={formItems} form={form} initialValues={detail} />
    </Modal>
  );
};

export default connect(({ sysTradeList, loading }) => ({
  tradeList: sysTradeList.list.list,
  loading: loading.effects['baseData/fetchSetTradeSelect'],
}))(SpecialGoodsTrade);
