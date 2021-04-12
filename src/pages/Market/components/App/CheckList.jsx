import React, { useState } from 'react';
import { connect } from 'umi';
import { Card, Modal } from 'antd';
import NoCheck from './CheckList/NoCheck';
import Checked from './CheckList/Checked';

const tabList = [
  {
    key: 'nocheck',
    tab: '待审核',
  },
  {
    key: 'checked',
    tab: '已审核',
  },
];
const CheckList = (props) => {
  const { visible, childRef, onClose } = props;
  const [tabkey, setTabKey] = useState('nocheck');
  const listProps = { tabkey };
  const contentList = {
    nocheck: <NoCheck {...listProps}></NoCheck>,
    checked: <Checked {...listProps}></Checked>,
  };
  return (
    <>
      <Modal
        title={'审核列表'}
        width={1150}
        destroyOnClose
        footer={null}
        visible={visible}
        onCancel={onClose}
      >
        <Card
          tabList={tabList}
          bordered={false}
          activeTabKey={tabkey}
          onTabChange={(key) => setTabKey(key)}
        >
          {contentList[tabkey]}
        </Card>
      </Modal>
    </>
  );
};
export default connect()(CheckList);
