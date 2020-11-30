import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { PHONE_PATTERN } from '@/common/regExp';
import { WORKER_JOB_TYPE } from '@/common/constant';
import {Drawer, Form, Button, Space, Transfer, Spin, notification} from 'antd';
import FormComponents from '@/components/FormCondition';
import CITYJSON from '@/common/city';


const UserSetForm = (props) => {
  const {
    workerManageUser,
    userInfo = {},
    childRef,
    dispatch,
    visible,
    onClose,
    loading,
  } = props;
  const { rolesList } = workerManageUser;

  const [form] = Form.useForm();

  const [roleIds, setRoleIds] = useState([]);
  const [cityData, setCityData] = useState([]);


  useEffect(() => {
    if (visible) setRoleIds(userInfo.roleIds ? userInfo.roleIds : []);
  }, [visible]);

  // 抽屉打开时请求选择参数
  const afterVisibleChange = (visible) => {
    if (visible) {
      fetchRoleList();
    }
  };

  // 获取角色列表
  const fetchRoleList = (info) => {
    dispatch({
      type: 'workerManageUser/fetchWMSUserRoles',
      payload: {
        ownerType: 'partner'
      },
      callback: (parentLsit) => fetchDetySetTwo(info, parentLsit),
    });
  };

  // 新增 / 修改角色
  const handleUpdata = () => {
    if(roleIds.length === 0) {
      return notification.warning({
        message: '温馨提示',
        description: '请配置角色',
      });
    }
    form.validateFields().then((values) => {
      const { password, mobile} = values;
      dispatch({
        type: userInfo.authPartnerId
          ? 'workerManageUser/fetchUserEditByPartner' // 修改
          : 'workerManageUser/fetchUserAddByPartner', // 新增
        payload: {
          ...userInfo,
          ...values,
          districtName: cityData[cityData.length-1].label,
          districtCode:cityData[cityData.length-1].value,
          password: password ? password : userInfo.authPartnerId ? undefined : mobile.match(/.*(.{6})/)[1],
          roleIds,
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
      label: '代理区县',
      type: 'cascader',
      name: 'districtName',
      onChange: (value) => setCityData(value)
    },
    {
      label: '代理公司名称',
      name: 'companyName',
    },
    {
      label: '联系人姓名',
      name: 'personName',
    },
    {
      label: '联系人岗位',
      name: 'post',
      rules: 'false'
    },

    {
      label: '手机号',
      name: 'mobile',
      addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
    },
    {
      label: '登录账号',
      name: 'account',
      addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
    },
    {
      label: '登录密码',
      name: 'password',
      rules: 'false',
      placeholder: '不输入默认手机号后6位',
    },
    {
      label: '性别',
      name: 'gender',
      type: 'radio',
      select: [
        { value: 'M', name: '男' },
        { value: 'F', name: '女' },
      ],
    },
    {
      label: '角色',
      name: 'roleIds',
      type: 'childrenOwn',
      rules: [{ required: false }],
      childrenOwn: (
        <Spin spinning={loading}>
          <Transfer
            showSearch
            targetKeys={roleIds}
            dataSource={rolesList}
            onChange={setRoleIds}
            titles={['可选', '已选']}
            operations={['添加', '删除']}
            render={(item) => item.title}
            listStyle={{
              width: 250,
              height: 300,
            }}
          />
        </Spin>
      ),
    },
    {
      label: '启用状态',
      name: 'status',
      type: 'radio',
      visible: !!userInfo.authPartnerId,
      select: ['停用', '启用'],
    },
  ];

  const modalProps = {
    title: `用户设置`,
    width: 650,
    visible,
    maskClosable: true,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      afterVisibleChange={afterVisibleChange}
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

export default connect(({ workerManageUser, workerManageSection, loading }) => ({
  workerManageUser,
  sectionList: workerManageSection.list,
  loading: loading.models.workerManageUser,
}))(UserSetForm);
