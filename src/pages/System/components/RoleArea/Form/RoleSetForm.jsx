import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Drawer, Form, Button, Space } from 'antd';
import FormComponents from '@/components/FormCondition';
import RoleTableForm from './RoleTableForm';

const RoleSetForm = (props) => {
  const { userInfo = {}, childRef, dispatch, visible, onClose, loading } = props;

  const [form] = Form.useForm();
  const tableRef = useRef();

  const [selectValue, setSelectValue] = useState([]);

  // 新增 / 修改角色
  const handleUpdata = () => {
    form.validateFields().then((values) => {
      const { roleName = {} } = values;
      const rolesObj = tableRef.current.fetchGetData();
      const { selectedBtns, selectedDatas, selectedRowKeys } = rolesObj;
      const permissionObjects = selectedRowKeys.map((item) => ({
        accessId: item,
        dataType: selectedDatas[item] || '1',
        buttons: selectedBtns[item],
      }));
      dispatch({
        type: userInfo.roleId
          ? 'roleProvinceArea/fetchWMSRoleEdit' // 修改
          : 'roleProvinceArea/fetchWMSRoleAdd', // 新增
        payload: {
          ownerType: 'partner',
          ...userInfo,
          ...values,
          // roleName: roleName.label,
          // roleKey: roleName.key,
          permissionObjects,
        },
        callback: () => {
          childRef.current.fetchGetData();
          onClose();
        },
      });
    });
  };

  // 角色可选搜索
  // const fetchWMSRoleSelect = () => {
  //   dispatch({
  //     type: 'roleProvinceArea/fetchWMSRoleSelect',
  //     callback: setSelectValue,
  //   });
  // };

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
      // required: true,
      rules: [{ required: false }],
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      childrenOwn: <RoleTableForm cRef={tableRef} userInfo={userInfo}></RoleTableForm>,
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

export default connect(({ roleProvinceArea, loading }) => ({
  roleProvinceArea,
  loading: loading.models.roleProvinceArea,
}))(RoleSetForm);
