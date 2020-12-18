import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { PHONE_PATTERN } from '@/common/regExp';
import { WORKER_JOB_TYPE } from '@/common/constant';
import { Drawer, Form, Button, Space, Transfer, Spin, notification } from 'antd';
import FormComponents from '@/components/FormCondition';

const UserSetForm = (props) => {
  const { userInfo = {}, childRef, sectionList = [], dispatch, visible, onClose, loading } = props;

  const [form] = Form.useForm();

  const [roleIds, setRoleIds] = useState([]);
  const [roleSelectList, setRoleSelectList] = useState([]);

  // 递归获取规则项目
  const getParentId = (list, iid) => {
    for (let o of list || []) {
      if (o.departmentIdString == iid) return o;
      const o_ = getParentId(o.children, iid);
      if (o_) return o_;
    }
  };

  useEffect(() => {
    if (visible) setRoleIds(userInfo.roleIds ? userInfo.roleIds : []);
  }, [visible]);

  useEffect(() => {
    if (Object.keys(userInfo).length) {
      const pid = getParentId(sectionList, userInfo.departmentId[0]);
      if (pid) {
        form.setFieldsValue({
          departmentId:
            pid.pidString == 0
              ? [userInfo.departmentId[0]]
              : [pid.pidString, userInfo.departmentId[0]],
        });
      }
    }
  }, [sectionList]);

  // 抽屉打开时请求选择参数
  const afterVisibleChange = (visible) => {
    if (visible) {
      fetchAllRoleSelect();
      fetchSectionList();
    }
  };

  // 获取角色选择项
  const fetchAllRoleSelect = () => {
    dispatch({
      type: 'roleSetting/fetchAllRoleSelect',
      payload: {
        ownerType: 'admin',
      },
      callback: setRoleSelectList,
    });
  };

  // 获取部门列表
  const fetchSectionList = () => {
    dispatch({
      type: 'sectionSetting/fetchGetList',
      payload: {
        departmentStatus: 1,
        clusterId: '0',
        ownerType: 'admin',
      },
    });
  };

  // 新增 / 修改
  const handleUpdata = () => {
    if (roleIds.length === 0) {
      return notification.warning({
        message: '温馨提示',
        description: '请配置角色',
      });
    }
    form.validateFields().then((values) => {
      const { password, mobile, departmentId, entryDate } = values;
      dispatch({
        type: userInfo.adminAccountId
          ? 'accountList/fetchOwnAccountEdit' // 修改
          : 'accountList/fetchOwnAccountAdd', // 新增
        payload: {
          ...userInfo,
          ...values,
          entryDate: entryDate ? entryDate.format('YYYY-MM-DD') : '',
          departmentId: departmentId[departmentId.length - 1],
          password: password
            ? password
            : userInfo.adminAccountId
            ? undefined
            : mobile.match(/.*(.{6})/)[1],
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
      label: '用户姓名',
      name: 'adminName',
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
      label: '登录手机号',
      name: 'mobile',
      addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
    },
    {
      label: '登录密码',
      name: 'password',
      rules: 'false',
      placeholder: '不输入默认手机号后6位',
    },
    {
      label: '入职日期',
      type: 'dataPicker',
      name: 'entryDate',
      rules: [{ required: false }],
    },
    {
      label: '邮箱地址',
      name: 'email',
      rules: 'false',
    },
    {
      label: '部门',
      name: 'departmentId',
      type: 'cascader',
      select: sectionList,
      changeOnSelect: true,
      fieldNames: { label: 'departmentName', value: 'departmentIdString' },
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
            dataSource={roleSelectList}
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
      label: '状态',
      name: 'workStatus',
      type: 'select',
      visible: !!userInfo.authAdminId,
      select: WORKER_JOB_TYPE,
    },
    {
      label: '启用状态',
      name: 'status',
      type: 'radio',
      visible: !!userInfo.authAdminId,
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

export default connect(({ sectionSetting, loading }) => ({
  sectionList: sectionSetting.list,
  loading: loading.models.accountList,
}))(UserSetForm);
