import React from 'react';
import { connect } from 'umi';
import { Form, Modal } from 'antd';
import TabTable from './TabTable';

const TabModal = (props) => {
  const { visible = {}, onClose, dispatch, loading, childRef, tabKey } = props;
  const { show = false, type, detail = {} } = visible;
  const { version } = detail;
  const [form] = Form.useForm();

  const modalProps = {
    title: `${{ iOS: 'IOS', android: 'Android' }[tabKey]}-${detail?.version}-编辑`,
    visible: show,
    onCancel: onClose,
    width: 1000,
    maskClosable: true,
    footer: false,
  };
  return (
    <Modal destroyOnClose {...modalProps} loading={loading}>
      <TabTable version={version} tabKey={tabKey}></TabTable>
    </Modal>
  );
};
export default connect(({ loading }) => ({
  loading: loading.effects['walkingManage/fetchAroundModuleCityList'],
}))(TabModal);
