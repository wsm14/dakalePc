import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import SubsidyDetail from './Detail/SubsidyDetail';
import SubsidyDirectMoney from './Form/SubsidyDirectMoney';

const SubsidyDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'info', show = false, detail = {} } = visible;
  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((value) => {
      dispatch({
        type: 'subsidyManage/fetchSubsidyAdd',
        payload: {
          ...value,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 统一处理
  const drawerProps = {
    add: {
      title: '新增任务',
      children: <SubsidyDirectMoney form={form} detail={detail}></SubsidyDirectMoney>,
      footer: (
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          提交
        </Button>
      ),
    },
    info: {
      title: '查看详情',
      children: <SubsidyDetail detail={detail}></SubsidyDetail>,
    },
  }[type];

  // 弹出窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['franchiseApp/fetchFranchiseHandle'],
}))(SubsidyDrawer);
