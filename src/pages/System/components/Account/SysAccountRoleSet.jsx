import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Checkbox, Form, Divider } from 'antd';

const SysRoleAllocation = (props) => {
  const { visible, setVisible, loading, dispatch, cRef, roleList } = props;

  const { show = false, record } = visible;

  const { roleIdList = [] } = record;
  
  const [form] = Form.useForm();
  const [indeterminate, setIndeterminate] = useState(false);
  const [checked, setChecked] = useState(false);

  // 确认
  const handleUpdata = () => {
    form.validateFields().then(() => {
      dispatch({
        type: 'sysAccountList/fetchAccountRoleEdit',
        payload: { ...record, ...form.getFieldsValue() },
        callback: () => {
          setVisible();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  // 全选
  const handleOnCheckAllChange = (e) => {
    form.setFieldsValue({
      roleIdList: e.target.checked ? roleList.map((item) => item.idString) : [],
    });
    if (e.target.checked) {
      setIndeterminate(false);
      setChecked(true);
    } else {
      setIndeterminate(false);
      setChecked(false);
    }
  };

  // 点击选择框改变选择状态
  const handleCheckbox = (checkedList) => {
    setIndeterminate(checkedList.length > 0 && checkedList.length < roleList.length);
    setChecked(checkedList.length === roleList.length);
  };

  useEffect(() => {
    if (show) {
      setChecked(roleIdList.length === roleList.length);
      setIndeterminate(roleIdList.length > 0 && roleIdList.length < roleList.length);
      form.setFieldsValue({ roleIdList: record.roleIdList });
    }
  }, [show]);

  return (
    <Modal
      title="配置角色权限"
      width={800}
      destroyOnClose
      visible={show}
      onCancel={setVisible}
      onOk={() => handleUpdata()}
      maskClosable={false}
      confirmLoading={loading}
    >
      <Form form={form} preserve={false} layout="horizontal" scrollToFirstError={true}>
        <Checkbox indeterminate={indeterminate} onChange={handleOnCheckAllChange} checked={checked}>
          全选
        </Checkbox>
        <Divider style={{ margin: '10px 0' }}></Divider>
        <Form.Item name="roleIdList" noStyle>
          <Checkbox.Group
            options={roleList.map((item) => ({ label: item.roleName, value: item.idString }))}
            onChange={handleCheckbox}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ sysAccountList, loading }) => ({
  roleList: sysAccountList.roleList,
  loading: loading.models.sysAccountList,
}))(SysRoleAllocation);
