import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';
import TaskConfigFormSet from './Form/TaskConfigFormSet';
import TaskOkConfigForm from './Form/TaskOkConfigForm';
import TaskConfigDetail from './Detail/TaskConfigDetail';

const TaskConfigDrawerSet = (props) => {
  const { visible, onClose, dispatch, loading, childRef } = props;
  const { show = false, type = 'info', detail = {} } = visible;

  const [form] = Form.useForm();

  //保存
  const handleSave = () => {
    form.validateFields().then((values) => {
      const { bean, coins } = values;
      const { subjectId, subjectTaskRelationId } = detail;

      let payload = {};
      if (type == 'edit') {
        payload = {
          subjectTaskRelationId,
          taskPrizeParam: JSON.stringify([{ type: 'coins', value: coins, img: '' }]),
        };
      } else if (type == 'taskOk') {
        payload = {
          bean,
          coins,
          subjectId,
        };
      }
      dispatch({
        type: {
          edit: 'marketConfigure/fetchUpdateSubjectTaskRelation',
          taskOk: 'marketConfigure/fetchUpdateSubjectPrize',
        }[type],
        payload,
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 统一处理弹窗
  const drawerProps = {};

  const modalProps = {
    visible: show,
    title: {
      edit: '编辑任务',
      taskOk: '任务完成配置',
      info: '详情',
    }[type],
    onClose,
    zIndex: 1001,
    footer: !['info'].includes(type) && (
      <Button type="primary" onClick={handleSave} loading={loading}>
        保存
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      {['edit'].includes(type) ? (
        <TaskConfigFormSet form={form} type={type} detail={detail}></TaskConfigFormSet>
      ) : ['taskOk'].includes(type) ? (
        <TaskOkConfigForm form={form} type={type} detail={detail}></TaskOkConfigForm>
      ) : (
        // info
        <TaskConfigDetail detail={detail}></TaskConfigDetail>
      )}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['marketConfigure/fetchUpdateSubjectTaskRelation'] ||
    loading.effects['marketConfigure/fetchUpdateSubjectPrize'],
}))(TaskConfigDrawerSet);
