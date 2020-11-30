import React from 'react';
import { connect } from 'dva';
import { Drawer, Form, Button, Space } from 'antd';
import FormComponents from '@/components/FormCondition';

const SectionEdit = (props) => {
  const { setInfo = {}, childRef, dispatch, visible, onClose, loading } = props;
  const [form] = Form.useForm();

  // 新增
  const handleUpdata = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'sectionSetting/fetchAllSectionAdd', // 新增
        payload: {
          ...values,
          pid: setInfo.departmentIdString || 0,
          weight: setInfo.weight,
          ownerType: 'admin',
          clusterId: 0,
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
      label: '部门名称',
      name: 'departmentName',
      maxLength: 10,
    },
    {
      label: '备注',
      type: 'textArea',
      name: 'remark',
      rules: [{ required: false }],
      maxLength: 20,
    },
  ];

  const modalProps = {
    title: `部门设置 - ${setInfo.departmentName || '新增'}`,
    width: 650,
    visible,
    maskClosable: true,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
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
      <FormComponents form={form} formItems={formItems}></FormComponents>
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.sectionSetting,
}))(SectionEdit);
