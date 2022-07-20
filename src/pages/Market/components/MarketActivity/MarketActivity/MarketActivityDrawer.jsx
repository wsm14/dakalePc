import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import MarketActivityDetail from './Deatil/MarketActivityDetail';
import MarketActivityBaseForm from './Form/BaseForm';

// 查看 修改 新增活动
const MarketActivityDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { mode = 'info', show = false, detail = {} } = visible;
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
          startDate: activeDate[0].format('YYYY-MM-DD HH:mm:ss'),
          endDate: activeDate[1].format('YYYY-MM-DD HH:mm:ss'),
          marketingActivityId: detail.id,
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
      <Button onClick={handleUpData} type="primary" loading={loading}>
        确定
      </Button>
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
      children: <MarketActivityDetail initialValues={detail}></MarketActivityDetail>,
    },
  }[mode];

  // 弹出窗属性
  const modalProps = {
    title: `${drawerProps.title}`,
    visible: show,
    width: 700,
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['marketActivity/fetchMarketActivitySet'],
}))(MarketActivityDrawer);
