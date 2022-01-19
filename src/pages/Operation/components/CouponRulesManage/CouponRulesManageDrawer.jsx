import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form, notification } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import CouponRulesManageDetail from './Detail/CouponRulesManageDetail';
import CouponRulesManageSet from './Form/CouponRulesManageSet';

const CouponDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail } = props;

  const { type = 'info', ruleId, show = false, detail = {} } = visible;

  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      const { ruleType, ruleConditions } = values;

      if (ruleConditions.length === 0) {
        notification.info({
          message: '温馨提示',
          description: '请选择必填数据',
        });
        return;
      }

      let data = {};
      // 行业
      if (ruleType === 'categoryRule') {
        data = {
          ruleConditions: ruleConditions.map((item) => ({
            condition: item[item.length - 1],
          })),
          remark: `已选${ruleConditions.length}个行业`,
        };
      }
      // 标签
      if (ruleType === 'tagRule') {
        data = {
          ruleConditions: ruleConditions.map((item) => ({
            condition: item,
          })),
        };
      }

      dispatch({
        type: 'couponRulesManage/fetchCreateRule',
        payload: {
          ...values,
          ...data,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const listProp = {
    type,
  };
  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '查看规则',
      children: <CouponRulesManageDetail ruleId={ruleId} detail={detail}></CouponRulesManageDetail>,
    },
    add: {
      title: '新建规则',
      children: (
        <CouponRulesManageSet
          {...listProp}
          form={form}
          initialValues={detail}
        ></CouponRulesManageSet>
      ),
    },
    // edit: {
    //   title: '编辑规则',
    //   children: (
    //     <CouponRulesManageSet
    //       {...listProp}
    //       form={form}
    //       initialValues={detail}
    //     ></CouponRulesManageSet>
    //   ),
    // },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    footer: ['add', 'edit'].includes(type) && (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        确定
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['couponRulesManage/fetchCreateRule'],
  loadingDetail: loading.effects['couponRulesManage/fetchRuleDetail'],
}))(CouponDrawer);
