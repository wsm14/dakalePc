import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button, Space } from 'antd';
import { MreSelect, MreSelectShow, UserSelectShow } from '@/components/MerUserSelectTable';
import { MATERIAL_JUMP_TYPE } from '@/common/constant';
import { createZip } from '../downZip';
import ImportDataModal from './ImportDataModal';
import ZipCreateLoading from '../ZipCreateLoading';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';

const CodeDrawerSet = (props) => {
  const { visible, childRef, onClose, dispatch, loading } = props;
  const { show = false, tabKey } = visible;

  const [visibleMer, setVisibleMer] = useState(false); // 选择店铺弹窗
  const [mreList, setMreList] = useState({ keys: [], list: [] }); // 选择店铺后回显的数据
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择用户弹窗
  const [userList, setUserList] = useState({ keys: [], list: [] }); // 选择后回显的数据
  const [visiblePort, setVisiblePort] = useState(false);
  const [percent, setPercent] = useState({ show: false, percent: 0, text: '文件绘制中......' }); // 文件绘制进度
  const [form] = Form.useForm();

  // 提交数据
  const handleSubmitData = (url, data) => {
    dispatch({
      type: 'materialConfig/fetchMaterialConfigSave',
      payload: {
        ...data,
        url,
        matterType: tabKey,
      },
      callback: () => {
        childRef.current.fetchGetData();
        onClose();
      },
    });
  };

  // 提交上传文件
  const handleUpData = (zip, data) => {
    setPercent({ show: true, percent: 100, text: '文件上传中......' });
    dispatch({
      type: 'publicModels/fetchGetOssUploadFile',
      payload: {
        file: zip, // 文件
        folderName: 'materials', // 文件夹名称
        fileType: 'zip', // 文件类型
        extension: '.zip', // 文件后缀名称
      },
      callback: (val) => {
        setPercent({ show: false });
        handleSubmitData(val, data);
      },
    });
  };

  //保存
  const handleSave = () => {
    form.validateFields().then((values) => {
      setPercent({ show: true, percent: 0, text: '文件绘制中......' });
      const { userObjectList, page, urlType } = values;
      if (tabKey === 'user') {
        handleGetUserCode({ userObjectList, page, urlType }, (val) =>
          createZip({ ...values, userObjectList: val }, tabKey, setPercent, (res, data) => {
            handleUpData(res, data);
          }),
        );
        return;
      }
      createZip(values, tabKey, setPercent, (res, data) => {
        handleUpData(res, data);
      });
    });
  };

  // 获取用户小程序码
  const handleGetUserCode = (data, callback) => {
    dispatch({
      type: 'materialConfig/fetchMaterialConfigUserCode',
      payload: data,
      callback,
    });
  };

  const modalProps = {
    visible: show,
    title: `营销码配置 - ${{ user: '用户码', merchant: '商家码' }[tabKey]}`,
    onClose,
    closeCallBack: () => {
      setPercent({ show: false });
      setMreList({ keys: [], list: [] });
      setUserList({ keys: [], list: [] });
    },
    footer: (
      <Button
        type="primary"
        onClick={handleSave}
        loading={
          loading.effects['publicModels/fetchGetOssUploadFile'] ||
          loading.effects['materialConfig/fetchMaterialConfigSave'] ||
          loading.effects['materialConfig/fetchMaterialConfigUserCode']
        }
      >
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
      name: 'matterName',
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
            setUserList(val);
            form.setFieldsValue({
              userObjectList: val.list.map((i) => ({ ...i, id: i.userIdString })),
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
      label: '二维码边长(px)',
      name: ['code', 'width'],
    },
    {
      label: '二维码上边距(px)',
      type: 'number',
      name: ['code', 'y'],
      min: 0,
      precision: 0,
    },
    {
      label: '二维码左边距(px)',
      type: 'number',
      name: ['code', 'x'],
      min: 0,
      precision: 0,
    },
    {
      label: '名称上边距(px)',
      type: 'number',
      name: ['name', 'y'],
      min: 0,
      precision: 0,
    },
    {
      label: '名称前缀',
      name: ['name', 'before'],
      rules: [{ required: false }],
    },
    {
      label: '名称后缀',
      name: ['name', 'after'],
      rules: [{ required: false }],
    },
    {
      label: '名称字体颜色',
      name: ['name', 'color'],
    },
    {
      label: '名称字体大小(px)',
      type: 'number',
      name: ['name', 'size'],
      min: 12,
      precision: 0,
    },
    {
      label: '名称字体透明度',
      type: 'number',
      name: ['name', 'opacity'],
      min: 0,
      max: 1,
      precision: 1,
    },
    {
      label: '跳转类型',
      name: 'urlType',
      type: 'radio',
      select: MATERIAL_JUMP_TYPE,
      visible: tabKey === 'user',
    },
    {
      label: '跳转链接',
      name: 'page',
      visible: tabKey === 'user',
      extra: '请填小程序链接',
    },
    {
      label: '下载内容',
      name: 'codeType',
      type: 'radio',
      visible: tabKey === 'merchant',
      select: { pay: '支付营销码', daka: '打卡营销码' },
    },
  ];

  const defineValue = {
    name: { color: '#ffffff', size: 30, opacity: 0.6 },
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormComponents
        form={form}
        formItems={formItems}
        initialValues={defineValue}
      ></FormComponents>
      {/* 等待绘制 */}
      <ZipCreateLoading {...percent}></ZipCreateLoading>
      {/* 选择店铺选择*/}
      <MreSelect
        keys={mreList.keys}
        visible={visibleMer}
        mreList={mreList.list}
        onOk={(val) => {
          setMreList(val);
          form.setFieldsValue({ merchantObject: val.list });
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
          const userListNew = list.map((i) => ({ userIdString: i.id, ...i }));
          setUserList({ list: userListNew });
          form.setFieldsValue({
            userObjectList: list,
          });
        }}
      ></ImportDataModal>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(CodeDrawerSet);
