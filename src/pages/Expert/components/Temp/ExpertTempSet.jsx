import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { MreSelect, MreSelectShow } from '@/components/MerUserSelectTable';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const ExpertTempSet = (props) => {
  const { dispatch, visible, childRef, experLevel, onClose, loading } = props;
  const [form] = Form.useForm();

  // 选择店铺弹窗
  const [visibleSelect, setVisibleSelect] = useState(false);
  // 选择店铺后回显的数据
  const [userList, setUserList] = useState({ keys: [], list: [] });

  // 新增
  const handleUpAction = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'expertTempList/fetchExpertTempAdd',
        payload: {
          ...values,
        },
        callback: closeDrawer,
      });
    });
  };

  // 关闭刷新事件
  const closeDrawer = () => {
    onClose();
    childRef.current.fetchGetData();
  };

  // 设置form表单值 店铺id
  useEffect(() => {
    form.setFieldsValue({ userIdList: userList.keys.toString() });
  }, [userList]);

  const formItems = [
    {
      label: '用户',
      name: 'userIdList',
      type: 'formItem',
      rules: [{ required: true, message: '请选择用户' }],
      formItem: (
        <Button type="primary" ghost onClick={() => setVisibleSelect(true)}>
          选择用户
        </Button>
      ),
    },
    {
      label: '适用店铺',
      type: 'noForm',
      formItem: (
        <MreSelectShow key="MreTable" {...userList} setUserList={setUserList}></MreSelectShow>
      ),
    },
    {
      label: '实习级别',
      name: 'tempLevel',
      type: 'select',
      select: experLevel,
    },
    {
      label: '实习期',
      type: 'rangePicker',
      name: 'beginDate',
      disabledDate: (current) => current && current < moment().endOf('day').subtract(1, 'day'),
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: '新增',
    visible,
    onClose,
    footer: (
      <Button onClick={handleUpAction} type="primary" loading={loading}>
        提交
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
      <MreSelect
        keys={userList.keys}
        visible={visibleSelect}
        userList={userList.list}
        onOk={(val) => setUserList(val)}
        onCancel={() => setVisibleSelect(false)}
      ></MreSelect>
    </DrawerCondition>
  );
};

export default connect(({ baseData, loading }) => ({
  experLevel: baseData.experLevel,
  loading: loading.effects['subsidyManage/fetchSubsidyTaskAdd'],
}))(ExpertTempSet);
