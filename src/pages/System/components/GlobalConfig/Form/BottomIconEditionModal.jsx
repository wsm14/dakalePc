import React from 'react';
import { connect } from 'umi';
import { Form, Modal } from 'antd';
import FormCondition from '@/components/FormCondition';

const EditionModal = (props) => {
  const { visible = {}, onClose, dispatch, loading, childRef, tabKey } = props;
  const { show = false, type, detail = {} } = visible;
  const { configBottomCenterIconId } = detail;
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: {
          add: 'globalConfig/fetchSaveConfigBottomCenterIcon',
          edit: 'globalConfig/fetchUpdateConfigBottomCenterIcon',
        }[type],
        payload: {
          configBottomCenterIconId,
          userOs: tabKey,
          flag: {
            add: 'addVersion',
            edit: 'updateVersion',
          }[type],
          ...values,
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
      label: `最低支持版本号`,
      name: 'version',
      placeholder: `请输入版本号`,
      extra: '注意：中间的间隔符必须用半角符号（如2.3.4）',
    },
  ];

  const modalProps = {
    title: `${{ add: '新增版本', edit: '修改版本' }[type]}`,
    visible: show,
    onCancel: onClose,
    onOk: handleOk,
  };
  return (
    <Modal destroyOnClose {...modalProps} loading={loading}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </Modal>
  );
};
export default connect(({ loading }) => ({
  loading:
    loading.effects['globalConfig/fetchSaveConfigBottomCenterIcon'] ||
    loading.effects['globalConfig/fetchUpdateConfigBottomCenterIcon'],
}))(EditionModal);
