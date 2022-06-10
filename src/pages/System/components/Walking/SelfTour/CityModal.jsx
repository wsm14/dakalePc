import React from 'react';
import { Modal } from 'antd';
import TabTable from './CityTable';

const TabModal = (props) => {
  const { visible = {}, onClose, tabKey } = props;
  const { show = false, detail = {} } = visible;
  const { version } = detail;

  const modalProps = {
    title: `${{ iOS: 'iOS', android: 'Android' }[tabKey]}-${detail?.version}-编辑`,
    visible: show,
    onCancel: onClose,
    width: 1000,
    maskClosable: true,
    footer: false,
    bodyStyle: { overflowY: 'auto', maxHeight: 600 },
  };

  return (
    <Modal destroyOnClose {...modalProps}>
      <TabTable version={version} tabKey={tabKey}></TabTable>
    </Modal>
  );
};

export default TabModal;
