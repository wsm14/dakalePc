import React from 'react';
import { connect } from 'umi';
import { Form, Modal } from 'antd';
import AppSetList from './AppSetList';

const AppSetModal = (props) => {
  const { visible = {}, onClose, dispatch, loading, childRef, tabKey, tabKeyTwo } = props;
  const { show = false, type, detail = {} } = visible;
  const { version } = detail;
  const [form] = Form.useForm();

  const modalProps = {
    title: `${{ iOS: 'iOS', android: 'Android' }[tabKeyTwo]}-${detail?.version}-编辑`,
    visible: show,
    onCancel: () => {
      childRef.current.fetchGetData();
      onClose();
    },
    width: 1000,
    maskClosable: true,
    footer: false,
    bodyStyle: { overflowY: 'auto', maxHeight: 600 },
  };
  return (
    <Modal destroyOnClose {...modalProps} loading={loading}>
      <AppSetList version={version} tabKey={tabKey} tabKeyTwo={tabKeyTwo}></AppSetList>
    </Modal>
  );
};
export default connect(({ loading }) => ({
  loading: loading.effects['sysAppList/fetchGetList'],
}))(AppSetModal);
