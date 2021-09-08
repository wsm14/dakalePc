import React, { useState } from 'react';
import { connect } from 'umi';
import DrawerCondition from '@/components/DrawerCondition';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import { UserSelectShow } from '@/components/MerUserSelectTable';

const EnvelopSet = (props) => {
  const { experLevel, onClose, childRef, visible = false } = props;
  const [form] = Form.useForm();
  const [envelopType, setEnvelopType] = useState(false);
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择用户弹窗
  const [userList, setUserList] = useState({ keys: [], list: [] });

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log(values, 'sss');
    });
  };

  const columns = [
    {
      title: '用户昵称',
      dataIndex: 'username',
      ellipsis: true,
    },
    {
      title: '注册手机号',
      dataIndex: 'mobile',
      render: (val) => val || '小程序用户',
    },
    {
      title: '角色',
      dataIndex: 'level',
      render: (val) => experLevel[val],
    },
    {
      title: '开通时间',
      dataIndex: 'beanCode',
    },
  ];

  const modalProps = {
    title: '权限设置',
    visible: visible,
    width: 800,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave}>
        保存
      </Button>
    ),
  };

  const formItems = [
    {
      label: '红包乐星',
      name: 'matterName',
      type: 'select',
      select: ['拼手气红包', '普通红包'],
      onChange: (val) => setEnvelopType(val),
    },
    {
      label: '使用权限设置',
      name: 'level',
      type: 'select',
      visible: envelopType == '0',
    },
    {
      label: '白名单列表',
      name: 'userIdList',
      type: 'formItem',
      visible: envelopType == '1',
      rules: [{ required: true, message: '请选择用户' }],
      formItem: (
        <Button type="primary" ghost onClick={() => setVisibleSelect(true)}>
          选择用户
        </Button>
      ),
    },
    {
      label: '适用用户',
      type: 'noForm',
      visible: envelopType == '1',
      formItem: (
        <UserSelectShow
          maxLength={500}
          key="UserTable"
          columns={columns}
          {...userList}
          showSelect={visibleSelect}
          onCancelShowSelect={() => setVisibleSelect(false)}
          onOk={(val) => {
            setUserList(val);
            form.setFieldsValue({ userIdList: val });
          }}
        ></UserSelectShow>
      ),
    },
  ];

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ baseData }) => ({
  experLevel: baseData.experLevel,
}))(EnvelopSet);
