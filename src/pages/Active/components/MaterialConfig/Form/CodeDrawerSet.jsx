import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, Space } from 'antd';
import FormComponents from '@/components/FormCondition';
import { MreSelect, MreSelectShow, UserSelectShow } from '@/components/MerUserSelectTable';
import ImportDataModal from './ImportDataModal';
import DrawerCondition from '@/components/DrawerCondition';

const CodeDrawerSet = (props) => {
  const { childRef, visible, onClose } = props;
  const { show = false, type, tabKey } = visible;

  const [visibleMer, setVisibleMer] = useState(false); // 选择店铺弹窗
  const [mreList, setMreList] = useState({ keys: [], list: [] }); // 选择店铺后回显的数据
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择用户弹窗
  const [userList, setUserList] = useState({ keys: [], list: [], resultList: [] }); // 选择后回显的数据

  const [visiblePort, setVisiblePort] = useState(false);
  const [form] = Form.useForm();

  //保存
  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log(values, 'form');
    });
  };

  const modalProps = {
    visible: show,
    title: '营销码配置',
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave}>
        保存
      </Button>
    ),
  };

  //批量导入事件2
  const handleImport = () => {
    setVisiblePort({
      show: true,
      tabKey,
    });
  };

  //用户table
  const userColumns = [
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '昵称',
      dataIndex: 'orderSn',
    },
    {
      title: '级别',
      dataIndex: 'orderSn',
    },
  ];

  //店铺table展示
  const merColumns = [
    {
      title: '店铺账号',
      dataIndex: 'account',
    },
    {
      title: '店铺名',
      dataIndex: 'merchantName',
    },
  ];

  const formItems = [
    {
      label: '配置名称',
      name: 'roleName',
    },
    {
      label: '适用用户',
      name: 'directChargeList',
      type: 'formItem',
      visible: tabKey === 'user',
      rules: [{ required: true, message: '请选择用户' }],
      formItem: (
        <Space size="large">
          <Button type="primary" ghost onClick={() => setVisibleSelect(true)}>
            选择用户
          </Button>
          <Button type="primary" ghost onClick={handleImport}>
            批量导入
          </Button>
        </Space>
      ),
    },
    {
      label: '选择店铺',
      name: 'merchantIds',
      type: 'formItem',
      rules: [{ required: true, message: '请选择店铺' }],
      visible: tabKey === 'merchant',
      formItem: (
        <Space size="large">
          <Button type="primary" ghost onClick={() => setVisibleMer(true)}>
            选择店铺
          </Button>
          <Button type="primary" ghost onClick={handleImport}>
            批量导入
          </Button>
        </Space>
      ),
    },
    {
      label: '适用用户',
      type: 'noForm',
      visible: tabKey === 'user',
      formItem: (
        <UserSelectShow
          maxLength={500}
          key="UserTable"
          columns={userColumns}
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

    {
      label: '适用店铺',
      type: 'noForm',
      visible: tabKey === 'merchant',
      formItem: (
        <MreSelectShow
          key="MreTable"
          {...mreList}
          columns={merColumns}
          setMreList={setMreList}
        ></MreSelectShow>
      ),
    },
    {
      label: '选择模板',
      name: 'templateImg',
      type: 'upload',
    },
    {
      label: '跳转链接',
      name: 'url',
      visible: tabKey === 'user',
    },
    {
      label: '下载内容',
      name: 'content',
      type: 'radio',
      visible: tabKey === 'merchant',
      select: [
        { value: '1', name: '支付营销码' },
        { value: '2', name: '打卡营销码' },
      ],
    },
  ];

  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems}></FormComponents>
      {/* 选择店铺选择*/}
      <MreSelect
        keys={mreList.keys}
        visible={visibleMer}
        mreList={mreList.list}
        onOk={(val) => setMreList(val)}
        onCancel={() => setVisibleMer(false)}
      ></MreSelect>
      <ImportDataModal
        visible={visiblePort}
        onClose={() => setVisiblePort(false)}
      ></ImportDataModal>
    </DrawerCondition>
  );
};

export default connect()(CodeDrawerSet);
