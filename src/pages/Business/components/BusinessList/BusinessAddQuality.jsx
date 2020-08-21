import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Switch, DatePicker } from 'antd';
import FormCondition from '@/components/FormCondition';

const { RangePicker } = DatePicker;

const BusinessAddQuality = (props) => {
  const { dispatch, initialValues, form, loading, brandList } = props;

  const [timeMust, setTimeMust] = useState(!initialValues.time);
  const [operateTimeMust, setOperateTimeMust] = useState(!initialValues.operateTimeMust);

  useEffect(() => {
    const boxCollection = document.getElementsByClassName('ant-drawer-body');
    boxCollection[0].scrollTo(0, 0);
  }, []);

  const formItems = [
    {
      title: '01 营业执照信息',
      label: '营业执照',
      name: 'den',
      type: 'upload',
      maxFile: 1,
    },
    {
      label: '社会信用代码',
      name: 'acTime',
    },
    {
      label: '字号名称',
      name: 'deion',
    },
    {
      label: '营业执照有效期',
      type: 'children',
      rules: 'false',
      required: true,
      children: (
        <>
          <Form.Item
            name="timeAAA"
            noStyle
            rules={[{ required: timeMust, message: '请选择营业执照有效期' }]}
          >
            <RangePicker
              style={{ width: '70%', marginRight: 10 }}
              disabled={!timeMust}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item name="time" noStyle valuePropName="checked">
            <Switch
              checkedChildren="长期有效"
              unCheckedChildren="长期有效"
              onChange={() => {
                setTimeMust(!timeMust);
                form.setFieldsValue({ timeAAA: [] });
              }}
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: '03 经营许可证',
      label: '经营许可证',
      name: 'dendassd',
      type: 'upload',
      maxFile: 1,
    },
    {
      label: '许可证编号',
      name: 'desasddn',
    },
    {
      label: '经营许可证有效期',
      type: 'children',
      rules: 'false',
      required: true,
      children: (
        <>
          <Form.Item
            name="operateTime"
            noStyle
            rules={[{ required: operateTimeMust, message: '请选择经营许可证有效期' }]}
          >
            <RangePicker
              style={{ width: '70%', marginRight: 10 }}
              disabled={!operateTimeMust}
              allowClear={false}
            />
          </Form.Item>
          <Form.Item name="operateTimeMust" noStyle valuePropName="checked">
            <Switch
              checkedChildren="长期有效"
              unCheckedChildren="长期有效"
              onChange={() => {
                setOperateTimeMust(!operateTimeMust);
                form.setFieldsValue({ operateTime: [] });
              }}
            />
          </Form.Item>
        </>
      ),
    },
    {
      label: '单位名称',
      name: 'dqwen',
    },
    {
      label: '社会信用代码',
      name: 'dewee',
    },
    {
      title: '03 银行账号',
      label: '账号性质',
      type: 'radio',
      name: 'dqwvn',
      select: ['对公', '对私'],
    },
    {
      label: '银行卡号',
      name: 'dmhgn',
    },
    {
      label: '开户行',
      name: 'defghn',
    },
    {
      label: '开户名',
      name: 'defghdn',
    },
    {
      label: '开户省',
      name: 'dedern',
    },
  ];

  return (
    <FormCondition
      formItems={formItems}
      initialValues={initialValues}
      form={form}
      loading={loading}
    />
  );
};

export default connect(({ businessList, loading }) => ({
  brandList: businessList.brandList.list,
  loading: loading.models.businessList,
}))(BusinessAddQuality);
