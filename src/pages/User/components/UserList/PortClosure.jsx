import React from 'react';
import { connect } from 'umi';
import { Button, Form, Modal } from 'antd';
import { USER_PORT_TYPE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const PortClosure = (props) => {
  const { dispatch, visible, loading, onClose, childRef, onCloseDetail } = props;
  const { show = false, detail = {}, type = 'enabled' } = visible;
  const { userId, ports = [] } = detail;
  const [form] = Form.useForm();

  const typeContent = {
    enabled: {
      buttonText: '解封',
      title: '确定解封吗？',
      type: 'userList/fetchSubPortUnsealUser',
      label: '解封端口',
    },
    closure: {
      buttonText: '封停',
      title: '封停后该用户不可登录已选端口，确定封停吗？',
      type: 'userList/fetchSubPortBlockUser',
      label: '封停端口',
    },
  }[type];

  const handleUserStatus = () => {
    Modal.confirm({
      title: typeContent.title,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        form.validateFields().then((values) => {
          dispatch({
            type: typeContent.type,
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
      label: typeContent.label,
      name: 'ports',
      type: 'checkbox',
      select: Object.keys(USER_PORT_TYPE).map((i) => ({
        label: USER_PORT_TYPE[i],
        value: `${i}`,
        disabled: type === 'enabled' ? !ports.includes(i) : ports.includes(i),
      })),
    },
  ];

  // 弹出窗属性
  const modalProps = {
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={() => handleUserStatus()} loading={loading}>
        {typeContent.buttonText}
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
    loading.effects['userList/fetchSubPortBlockUser'] ||
    loading.effects['userList/fetchSubPortUnsealUser'],
}))(PortClosure);
