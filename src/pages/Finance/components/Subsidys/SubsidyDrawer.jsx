import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import SubsidyDetail from './Detail/SubsidyDetail';
import SubsidyDirectMoney from './Form/SubsidyDirectMoney';
import SubsidyRecycleBean from './Form/SubsidyRecycleBean';
import SubsidyActionSet from './Form/SubsidyActionSet';
import aliOssUpload from '@/utils/aliOssUpload';

const SubsidyDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'add', tab = 'task', show = false, detail = {} } = visible;
  const [form] = Form.useForm();

  // 关闭刷新事件
  const closeDrawer = () => {
    onClose();
    childRef.current.fetchGetData();
  };

  // 新增 task 营销卡豆充值 direct 平台直充 batch 卡豆回收
  const handleUpAddTask = () => {
    form.validateFields().then((values) => {
      const { certificate } = values;
      aliOssUpload(certificate).then((res) => {
        const disProps = {
          // 卡豆回收
          batch: {
            type: 'subsidyManage/fetchSubsidyRecycleBean',
            payload: {
              type: { task: 'platform', direct: 'directCharge' }[tab],
            },
          },
          // 新增
          add: {
            type: {
              task: 'subsidyManage/fetchSubsidyTaskAdd',
              direct: 'subsidyManage/fetchSubsidyDirectAdd',
            }[tab],
            payload: {},
          },
        }[type];
        dispatch({
          type: disProps.type,
          payload: {
            ...values,
            ...disProps.payload,
            certificate: res.toString(),
          },
          callback: closeDrawer,
        });
      });
    });
  };

  // 新增行为
  const handleUpAction = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'subsidyManage/fetchSubsidyActionAdd',
        payload: {
          ...values,
          id: detail.configBehaviorId,
        },
        callback: closeDrawer,
      });
    });
  };

  // 营销卡豆充值 平台直充
  const subsudyProps = {
    add: {
      title: '新增',
      children: <SubsidyDirectMoney form={form} detail={detail}></SubsidyDirectMoney>,
      footer: (
        <Button onClick={handleUpAddTask} type="primary" loading={loading}>
          提交
        </Button>
      ),
    },
    batch: {
      title: '卡豆回收',
      children: <SubsidyRecycleBean form={form} detail={detail}></SubsidyRecycleBean>,
      footer: (
        <Button onClick={handleUpAddTask} type="primary" loading={loading}>
          提交
        </Button>
      ),
    },
    info: {
      title: '查看详情',
      children: <SubsidyDetail detail={detail}></SubsidyDetail>,
    },
  }[type];

  // 统一处理
  const drawerProps = {
    task: subsudyProps, // 营销卡豆充值
    direct: subsudyProps, // 平台直充
    // 规则列表
    action: {
      title: type === 'add' ? '新增规则' : '修改规则',
      children: <SubsidyActionSet form={form} detail={detail}></SubsidyActionSet>,
      footer: (
        <Button onClick={handleUpAction} type="primary" loading={loading}>
          提交
        </Button>
      ),
    },
  }[tab];

  // 弹出窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    width: 800,
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['subsidyManage/fetchSubsidyTaskAdd'] ||
    loading.effects['subsidyManage/fetchSubsidyActionAdd'] ||
    loading.effects['subsidyManage/fetchSubsidyDirectAdd'],
}))(SubsidyDrawer);
