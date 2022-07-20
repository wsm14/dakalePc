import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';
import TaskConfigFormSet from './Form/TaskConfigFormSet';
import TaskConfigDetail from './Detail/TaskConfigDetail';

const TaskConfigDrawerSet = (props) => {
  const { visible, onClose, dispatch, loading, childRef } = props;
  const { show = false, type = 'add', detail = {} } = visible;

  const [form] = Form.useForm();

  //保存
  const handleSave = () => {
    form.validateFields().then(async (values) => {});
  };

  // 统一处理弹窗
  const drawerProps = {};

  const modalProps = {
    visible: show,
    title: '弹窗内容配置',
    onClose,
    zIndex: 1001,
    footer: !['info'].includes(type) && (
      <Button
        type="primary"
        onClick={handleSave}
        loading={
          loading.effects['marketConfigure/fetchSaveConfigNewUserPopUp'] ||
          loading.effects['marketConfigure/fetchUpdateConfigNewUserPopUp']
        }
      >
        保存
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      {['edit', 'taskLink', 'taskOk'].includes(type) ? (
        <TaskConfigFormSet form={form} detail={detail}></TaskConfigFormSet>
      ) : (
        // info
        <TaskConfigDetail detail={detail}></TaskConfigDetail>
      )}
      {/* <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents> */}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({ loading }))(TaskConfigDrawerSet);
