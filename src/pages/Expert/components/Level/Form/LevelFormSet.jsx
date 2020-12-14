import React from 'react';
import { connect } from 'dva';
import { Drawer, Form, InputNumber, Space, Button } from 'antd';
import FormCondition from '@/components/FormCondition';

const LevelFormSet = (props) => {
  const { visible, keyRow, showlistData, onCancel, loading, fetchExpertLevelSet } = props;

  const { type = 'set', detail = '', show = false } = visible;

  const [form] = Form.useForm();

  // 提交
  const fetchFormData = () => {
    form.validateFields().then((values) => {
      const { name, title, icon } = detail;
      // 处理数据返回新数据数组
      const newArr = showlistData.map((item) =>
        item.name == name ? { name, title, icon, value: values.value } : item,
      );
      fetchExpertLevelSet(newArr, 'edit');
    });
  };

  const formObj = {
    style: { display: 'inline-block', width: 'calc(50% - 12px)' },
    rules: [{ required: true, message: '请输入数字' }],
  };

  const delSpan = (
    <span
      style={{
        display: 'inline-block',
        width: '24px',
        lineHeight: '32px',
        textAlign: 'center',
      }}
    >
      -
    </span>
  );

  const formItems = [
    {
      label: '输入数值',
      name: 'value',
      type: 'number',
      min: 1,
      precision: 0,
      visible: detail.name != 'exclusiveCoupon',
    },
    {
      label: '设置数值',
      name: 'value',
      visible: detail.name == 'exclusiveCoupon',
      type: 'noForm',
      childrenOwn: (
        <Form.Item label="设置数值" style={{ marginBottom: 0 }}>
          <Form.Item name={['value', 'startMoney']} {...formObj}>
            <InputNumber style={{ width: '100%' }} min={1} precision={0} />
          </Form.Item>
          {delSpan}
          <Form.Item name={['value', 'endMoney']} {...formObj}>
            <InputNumber style={{ width: '100%' }} min={1} precision={0} />
          </Form.Item>
        </Form.Item>
      ),
    },
    {
      label: '设置张数',
      name: 'value',
      visible: detail.name == 'exclusiveCoupon',
      type: 'noForm',
      childrenOwn: (
        <Form.Item label="设置张数" style={{ marginBottom: 0 }}>
          <Form.Item name={['value', 'startCount']} {...formObj}>
            <InputNumber style={{ width: '100%' }} min={1} precision={0} />
          </Form.Item>
          {delSpan}
          <Form.Item name={['value', 'endCount']} {...formObj}>
            <InputNumber style={{ width: '100%' }} min={1} precision={0} />
          </Form.Item>
        </Form.Item>
      ),
    },
  ];

  // Drawer
  const propItem = {
    target: {
      title: `编辑任务 - ${detail.titleName}`,
    },
    rights: {
      title: `编辑权益 - ${detail.titleName}`,
    },
  }[keyRow];

  const modalProps = {
    title: propItem.title,
    width: 560,
    visible: show,
    maskClosable: true,
    destroyOnClose: true,
    zIndex: 1005,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onCancel}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button onClick={fetchFormData} type="primary" loading={loading}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <FormCondition formItems={formItems} initialValues={detail} form={form} />
    </Drawer>
  );
};

export default connect(({ loading }) => ({ loading: loading.models.expertLevel }))(LevelFormSet);
