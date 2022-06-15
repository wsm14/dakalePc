import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import DrawerCondition from '@/components/DrawerCondition';
import MessageDetail from './Deatil/MessageDetail';
import MarketActivityBaseForm from './Form/BaseForm';

const MarketActivityDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { mode = 'info', shwo = false, detail = {} } = visible;
  const [form] = Form.useForm();

  const handleUpData = () => {
    form.validateFields().then((value) => {
      const { activeDate, activityRuleObject = {}, useRuleObject = {}, ...other } = value;
      // 活动规则
      const { activityRuleType, classifies = [], categories = [] } = activityRuleObject;
      // 使用规则
      const { useRuleType } = useRuleObject;
      dispatch({
        type: 'marketActivity/fetchMarketActivitySet',
        payload: {
          ...other,
          mode,
          activityRuleObject: {
            ...activityRuleObject,
            activityRuleType: activityRuleType.toString(),
            categories: categories.map((i) => ({ categoryId: i })), // 行业规则
            classifies: classifies.map((i) => ({ classifyId: i[i.length - 1] })), // 类目规则
          },
          useRuleObject: { ...useRuleObject, useRuleType: useRuleType.toString() },
          startDate: activeDate[0].format('YYYY-MM-DD'),
          endDate: activeDate[1].format('YYYY-MM-DD'),
          marketingActivityId: detail.marketingActivityId,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 新增修改公共处理
  const addEditProps = {
    children: <MarketActivityBaseForm form={form} initialValues={detail}></MarketActivityBaseForm>,
    footer: (
      <AuthConsumer auth="save" show={mode === 'add'}>
        <Button onClick={handleUpData} type="primary" loading={loading}>
          确定
        </Button>
      </AuthConsumer>
    ),
  };

  // 统一处理
  const drawerProps = {
    add: {
      title: '新建活动',
      ...addEditProps,
    },
    edit: {
      title: '修改活动',
      ...addEditProps,
    },
    info: {
      title: '查看活动',
      children: <MessageDetail initialValues={detail}></MessageDetail>,
    },
  }[mode];

  // 弹出窗属性
  const modalProps = {
    title: `${drawerProps.title}`,
    visible: shwo,
    width: 700,
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['marketActivity/fetchMarketActivitySet'],
}))(MarketActivityDrawer);
