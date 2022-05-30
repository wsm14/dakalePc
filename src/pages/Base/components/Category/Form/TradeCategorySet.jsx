import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const TradeCategorySet = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;

  const [form] = Form.useForm();
  const { show = false, status = 'add', detail = {} } = visible;
  const { ranking } = detail;
  // 提交表单
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      const { isDelete, ...other } = values;
      dispatch({
        type: { add: 'Category/fetchBackCategoryAdd', edit: 'Category/fetchBackCategoryEdit' }[
          status
        ],
        payload: {
          ...detail,
          ...other,
          isDelete: isDelete ? (isDelete == 1 ? 0 : 1) : 1,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '父级类目',
      name: 'parentName',
      visible: ['second', 'third'].includes(ranking),
      disabled: true,
    },
    {
      label: '一级类目名称',
      name: 'classifyName',
      visible: ranking === 'first',
      maxLength: 20,
    },
    {
      label: '二级类目名称',
      visible: ranking === 'second',
      name: 'classifyName',
      maxLength: 20,
    },
    {
      label: '三级类目名称',
      visible: ranking === 'third',
      name: 'classifyName',
      maxLength: 20,
    },
    {
      label: '权重',
      name: 'sortValue',
    },
    {
      label: '状态',
      name: 'isDelete',
      type: 'switch',
      required: true,
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: `${status === 'add' ? '新增类目' : '编辑类目'}`,
    visible: show,
    onClose,
    footer: (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        提交
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
  loading:
    loading.effects['Category/fetchBackCategoryAdd'] ||
    loading.effects['Category/fetchBackCategoryEdit'],
}))(TradeCategorySet);
