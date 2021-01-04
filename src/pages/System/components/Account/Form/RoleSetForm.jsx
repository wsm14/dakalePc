import React, { useRef } from 'react';
import { connect } from 'umi';
import { Drawer, Form, Button, Space } from 'antd';
import FormComponents from '@/components/FormCondition';
import RoleTableForm from './RoleTableForm';

const RoleSetForm = (props) => {
  const { userInfo = {}, flag, childRef, dispatch, visible, onClose, loading } = props;

  const [form] = Form.useForm();
  const tableRef = useRef();

  // 新增 / 修改角色
  const handleUpdata = () => {
    form.validateFields().then((values) => {
      const rolesObj = tableRef.current.fetchGetData();
      const { selectedBtns, selectedDatas = {}, selectedRowKeys } = rolesObj;
      const permissionObjects = selectedRowKeys.map((item) => ({
        accessId: item,
        dataType: selectedDatas[item] || '1',
        buttons: selectedBtns[item],
      }));
      dispatch({
        type: userInfo.roleId
          ? 'roleSetting/fetchAllRoleEdit' // 修改
          : 'roleSetting/fetchAllRoleAdd', // 新增
        payload: {
          ...userInfo,
          ...values,
          ownerType: 'admin',
          permissionObjects,
        },
        callback: () => {
          childRef.current.fetchGetData();
          onClose();
        },
      });
    });
  };

  const formItems = [
    {
      label: '角色名称',
      name: 'roleName',
    },
    {
      label: '备注',
      name: 'remark',
      type: 'textArea',
      rules: [{ required: false }],
    },
    {
      label: '操作权限设置',
      name: 'roleIds',
      type: 'childrenOwn',
      rules: [{ required: false }],
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      childrenOwn: <RoleTableForm cRef={tableRef} flag={flag} userInfo={userInfo}></RoleTableForm>,
    },
  ];

  const modalProps = {
    title: `角色设置`,
    width: 850,
    visible,
    maskClosable: true,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      // afterVisibleChange={(show) => {
      //   if (show) {
      //     fetchWMSRoleSelect();
      //   }
      // }}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={handleUpdata} type="primary" loading={loading}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <FormComponents form={form} formItems={formItems} initialValues={userInfo}></FormComponents>
    </Drawer>
  );
};

export default connect(({ roleSetting, loading }) => ({
  roleSetting,
  loading: loading.models.roleSetting,
}))(RoleSetForm);
