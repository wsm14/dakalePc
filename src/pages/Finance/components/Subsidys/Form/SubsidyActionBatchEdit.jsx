import React from 'react';
import { connect } from 'umi';
import { Modal, Form } from 'antd';
import { NUM_INT } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';

const SubsidyActionBatchEdit = (props) => {
  const { dispatch, cRef, actionIdList, visible, onClose, loading } = props;

  const [form] = Form.useForm();

  // 审核驳回
  const fetchMerSaleAudit = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'subsidyManage/fetchActionBatchEdit',
        payload: {
          configBehaviorIdList: actionIdList,
          ...values,
        },
        callback: () => {
          cRef.current.fetchGetData();
          onClose();
        },
      });
    });
  };

  const formItems = [
    {
      label: '补贴卡豆数',
      name: 'subsidyBean',
      placeholder: '请输入单用户最高补贴卡豆数',
      suffix: '卡豆',
      addRules: [{ pattern: NUM_INT, message: '卡豆数量应为整数' }],
    },
  ];

  const modalProps = {
    title: '批量修改',
    visible,
    width: 520,
    onCancel: onClose,
    confirmLoading: loading,
    onOk: fetchMerSaleAudit,
  };

  return (
    <Modal {...modalProps} destroyOnClose>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['subsidyManage/fetchActionBatchEdit'],
}))(SubsidyActionBatchEdit);
