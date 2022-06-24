import React from 'react';
import { connect } from 'umi';
import { Button, Form, Modal } from 'antd';
import { USER_PORT_TYPE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const PortClosure = (props) => {
  const { dispatch, visible, loading, onClose, childRef, onCloseDetail } = props;
  const { show = false, detail = {} } = visible;
  const { userId } = detail;
  const [form] = Form.useForm();

  const handleUserStatus = () => {
    Modal.confirm({
      title: `封停后该用户不可登录已选端口，确定封停吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        form.validateFields().then((values) => {
          dispatch({
            type: 'userList/fetchSubPortBlockUser',
            payload: {
              userId,
              ...values,
            },
            callback: () => {
              onClose();
              onCloseDetail();
              childRef.current.fetchGetData();
            },
          });
        });
      },
    });
  };

  const formItems = [
    {
      label: '封停端口',
      name: 'ports',
      type: 'checkbox',
      select: USER_PORT_TYPE,
    },
  ];

  // 弹出窗属性
  const modalProps = {
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={() => handleUserStatus()} loading={loading}>
        封停
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
  loading: loading.effects['userList/fetchSubPortBlockUser'],
}))(PortClosure);
