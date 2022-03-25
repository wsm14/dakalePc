import React from 'react';
import { connect } from 'umi';
import { Button, Form, InputNumber } from 'antd';
import { NO_BLOCK_PATTERN, ONLY_ENGLISH_PATTERN } from '@/common/regExp';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const AddImgplace = (props) => {
  const { loading, visible, onClose, tabKey, dispatch, getType } = props;

  const [form] = Form.useForm();

  const formItems = [
    {
      title: '图片位置名称',
      label: '中文命名',
      name: 'desc',
      maxLength: 10,
      addRules: [
        {
          pattern: NO_BLOCK_PATTERN,
          message: '请勿携带空格',
        },
      ],
    },
    {
      label: '英文命名',
      name: 'type',
      addRules: [
        {
          pattern: NO_BLOCK_PATTERN,
          message: '请勿携带空格',
        },
        {
          pattern: ONLY_ENGLISH_PATTERN,
          message: '仅支持输入英文',
        },
      ],
    },
    {
      label: '图片尺寸宽度',
      name: 'width',
      type: 'number',
      rules: [{ required: false }],
      placeholder: '请输入图片尺寸宽度（px）',
    },
    {
      label: '图片尺寸高度',
      name: 'height',
      type: 'number',
      rules: [{ required: false }],
      placeholder: '请输入图片尺寸高度（px）',
    },
  ];

  // 确定新增
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'sysAppList/fetchSaveConfigBannerType',
        payload: {
          userType: tabKey,
          ...values,
        },
        callback: () => {
          onClose();
          getType();
        },
      });
    });
  };

  const modalProps = {
    title: '新增图片位置',
    visible,
    onClose,
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['sysAppList/fetchSaveConfigBannerType'],
}))(AddImgplace);
