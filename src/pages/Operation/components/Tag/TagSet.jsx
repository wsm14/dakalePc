import React from 'react';
import { connect } from 'umi';
import { MRE_TAG_STATUS } from '@/common/constant';
import { Drawer, Button, Space, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const ClassifySet = (props) => {
  const { dispatch, visible = {}, onClose, cRef, loading } = props;
  const { type = '', detail = {} } = visible;

  const [form] = Form.useForm();

  // 确认数据
  const fetchUpData = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: {
          add: 'tagManage/fetchTagAdd',
          edit: 'tagManage/fetchTagEdit',
        }[type],
        payload: {
          ...values,
          configMerchantId: detail.configMerchantId,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '标签名称',
      name: 'tagName',
      maxLength: 10,
    },
    {
      label: '标签状态',
      name: 'status',
      type: 'radio',
      visible: type === 'edit',
      select: MRE_TAG_STATUS,
    },
  ];

  return (
    <Drawer
      title={`设置分类`}
      width={600}
      visible={!!type}
      destroyOnClose={true}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={fetchUpData} type="primary" loading={loading}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <FormCondition formItems={formItems} form={form} initialValues={detail} />
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.tagManage,
}))(ClassifySet);
