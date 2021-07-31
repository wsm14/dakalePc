import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button, Space } from 'antd';
import { MreSelect, MreSelectShow, UserSelectShow } from '@/components/MerUserSelectTable';
import ImportDataModal from './ImportDataModal';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';

const CodeDrawerSet = (props) => {
  const { visible, onClose, dispatch, loading } = props;
  const { show = false, tabKey } = visible;

  const [visibleMer, setVisibleMer] = useState(false); // 选择店铺弹窗
  const [mreList, setMreList] = useState({ keys: [], list: [] }); // 选择店铺后回显的数据
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择用户弹窗
  const [userList, setUserList] = useState({ keys: [], list: [] }); // 选择后回显的数据
  const [visiblePort, setVisiblePort] = useState(false);
  const [form] = Form.useForm();

  //保存
  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log(values, 'form');
    });
  };

  // 获取用户小程序码
  const handleGetUserCode = (data, callback) => {
    dispatch({
      type: 'materialConfig/fetchMaterialConfigUserCode',
      payload: {
        userObjectList: data,
      },
      callback,
    });
  };

  const modalProps = {
    visible: show,
    title: `营销码配置 - ${{ user: '用户码', merchant: '商家码' }[tabKey]}`,
    onClose,
    closeCallBack: () => {
      setMreList({ keys: [], list: [] });
      setUserList({ keys: [], list: [] });
    },
    footer: (
      <Button type="primary" onClick={handleSave}>
        保存
      </Button>
    ),
  };

  //批量导入事件
  const handleImport = () => setVisiblePort({ show: true, tabKey });

  //用户table
  const userColumns = [
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '昵称',
      dataIndex: 'username',
    },
    {
      title: '级别',
      dataIndex: 'level',
      // render: (val) => experLevel[val],
    },
  ];

  //店铺table展示
  const merColumns = [
    {
      title: '店铺账号',
      dataIndex: 'mobile',
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
      label: '选择用户',
      name: 'userObjectList',
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
      label: '适用用户',
      type: 'noForm',
      visible: tabKey === 'user',
      formItem: (
        <UserSelectShow
          maxLength={500}
          key="UserTable"
          loading={loading.effects['materialConfig/fetchMaterialConfigUserCode']}
          columns={userColumns}
          rowSelection={false}
          {...userList}
          showSelect={visibleSelect}
          onCancelShowSelect={() => setVisibleSelect(false)}
          onOk={(val) => {
            handleGetUserCode(val.list, (list) => {
              setUserList(val);
              form.setFieldsValue({ userObjectList: list });
            });
          }}
        ></UserSelectShow>
      ),
    },
    {
      label: '选择店铺',
      name: 'merchantObject',
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
      label: '适用店铺',
      type: 'noForm',
      visible: tabKey === 'merchant',
      formItem: (
        <MreSelectShow
          key="MreTable"
          {...mreList}
          rowSelection={false}
          columns={merColumns}
          setMreList={(val) => {
            form.setFieldsValue({ merchantObject: val });
            setMreList(val);
          }}
        ></MreSelectShow>
      ),
    },
    {
      label: '上传背景图',
      name: 'templateImg',
      type: 'upload',
      onChange: ({ file }) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          // 获取上传的图片的宽高
          const img = new Image();
          img.onload = function () {
            form.setFieldsValue({
              templateImg: e.target.result,
              img: { height: img.naturalHeight, width: img.naturalWidth },
            });
          };
          img.src = e.target.result;
        };
      },
    },
    {
      label: '背景宽度',
      name: ['img', 'height'],
      hidden: true,
    },
    {
      label: '背景高度',
      name: ['img', 'width'],
      hidden: true,
    },
    {
      label: '二维码边长',
      name: ['code', 'width'],
    },
    {
      label: '二维码上边距',
      type: 'number',
      name: ['code', 'y'],
      min: 0,
      precision: 2,
    },
    {
      label: '二维码左边距',
      type: 'number',
      name: ['code', 'x'],
      min: 0,
      precision: 2,
    },
    {
      label: '跳转链接',
      name: 'url',
      visible: tabKey === 'user',
      extra: '请填小程序链接',
    },
    {
      label: '下载内容',
      name: 'codeType',
      type: 'radio',
      visible: tabKey === 'merchant',
      select: [
        { value: 'pay', name: '支付营销码' },
        { value: 'daka', name: '打卡营销码' },
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
        onOk={(val) => {
          setMreList(val);
          form.setFieldsValue({ merchantObject: val });
        }}
        onCancel={() => setVisibleMer(false)}
      ></MreSelect>
      {/* 导入数据 */}
      <ImportDataModal
        visible={visiblePort}
        onClose={() => setVisiblePort(false)}
        setMreList={(list) => {
          form.setFieldsValue({ merchantObject: list });
          setMreList({ list });
        }}
        setUserList={(list) => {
          handleGetUserCode(list, (newList) => {
            const userListNew = newList.map((i) => ({ userIdString: i.id, ...i }));
            setUserList({ list: userListNew });
            form.setFieldsValue({
              userObjectList: newList,
            });
          });
        }}
      ></ImportDataModal>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(CodeDrawerSet);
