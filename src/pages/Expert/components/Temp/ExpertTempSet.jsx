import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { UserSelectShow } from '@/components/MerUserSelectTable';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const ExpertTempSet = (props) => {
  const { dispatch, visible, childRef, experLevel, onClose, loading } = props;
  const [form] = Form.useForm();

  const [visibleSelect, setVisibleSelect] = useState(false); // 选择弹窗
  const [userList, setUserList] = useState({ keys: [], list: [], resultList: [] }); // 选择后回显的数据
  const [maxLevel, setMaxLevel] = useState(999);

  // 新增
  const handleUpAction = () => {
    form.validateFields().then((values) => {
      const { beginDate } = values;
      dispatch({
        type: 'expertTempList/fetchExpertTempAdd',
        payload: {
          ...values,
          beginDate: beginDate[0].format('YYYY-MM-DD'),
          endDate: beginDate[1].format('YYYY-MM-DD'),
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
    const { resultList } = userList;
    const maxLevelUser = lodash.maxBy(resultList, (item) => item.level) || {};
    setMaxLevel(Number(maxLevelUser.level || 999));
    form.setFieldsValue({ userIdList: userList.keys });
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
      label: '适用用户',
      type: 'noForm',
      formItem: (
        <UserSelectShow
          key="UserTable"
          {...userList}
          showSelect={visibleSelect}
          onCancelShowSelect={() => setVisibleSelect(false)}
          onOk={(val) => {
            form.setFieldsValue({ tempLevel: undefined });
            setUserList(val);
          }}
        ></UserSelectShow>
      ),
    },
    {
      label: '实习级别',
      name: 'tempLevel',
      type: 'radio',
      select: Object.keys(experLevel)
        .filter((i) => i != 0)
        .map((item) => ({
          name: experLevel[item],
          value: `${item}`,
          disabled: maxLevel >= Number(item),
        })),
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
    closeCallBack: () => setUserList({ keys: [], list: [], resultList: [] }),
    footer: (
      <Button onClick={handleUpAction} type="primary" loading={loading}>
        提交
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ baseData, loading }) => ({
  experLevel: baseData.experLevel,
  loading: loading.effects['subsidyManage/fetchSubsidyTaskAdd'],
}))(ExpertTempSet);
