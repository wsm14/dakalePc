import React from 'react';
import { connect } from 'umi';
import { Button, Tabs, Alert, Form, notification } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import GoodsDetailForm from './Detail/GoodsDetail';
import RegularDetail from './Detail/RegularDetail';
import FormCondition from '@/components/FormCondition';
import AuthConsumer from '@/layouts/AuthConsumer';

const SpecialGoodDetail = (props) => {
  const {
    visible,
    onClose,
    onEdit,
    total,
    getDetail,
    loading,
    setVisibleRefuse,
    fetchSpecialGoodsVerify,
  } = props;
  const { show = false, index, detail = {}, status } = visible;

  const [form] = Form.useForm();

  const handleEdit = () => {
    onClose(), onEdit();
  };

  // 审核通过
  const handleVerifyAllow = () => {
    const { specialGoodsId, merchantIdStr } = detail;
    if (!form.getFieldValue('otherPlatformPrice')) {
      notification.info({
        message: '温馨提示',
        description: '请输入其他平台价格',
      });
    }
    form.validateFields().then((values) => {
      fetchSpecialGoodsVerify({ ...values, specialGoodsId, merchantIdStr, status: 1 });
    });
  };

  // 弹出窗属性
  const modalProps = {
    title: '活动详情',
    visible: show,
    loading,
    onClose,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: (
      <>
        {['1', '2'].includes(status) && (
          <AuthConsumer auth="edit">
            <Button type="primary" onClick={handleEdit}>
              编辑
            </Button>
          </AuthConsumer>
        )}
        {['3'].includes(status) && (
          <AuthConsumer auth="check">
            <Button type="primary" onClick={handleVerifyAllow}>
              审核通过
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              danger
              onClick={() =>
                setVisibleRefuse({
                  show: true,
                  detail: detail,
                  type: 'refuse',
                  formProps: { type: 'refuse', key: 'failureReason' },
                })
              }
            >
              审核驳回
            </Button>
          </AuthConsumer>
        )}
      </>
    ),
  };

  const formItems = [
    {
      label: `其他平台价格`,
      name: 'otherPlatformPrice',
    },
  ];

  return (
    <DrawerCondition {...modalProps}>
      {/* 驳回原因 */}
      {status == '4' && <Alert message={`驳回原因：${detail.failureReason}`} type="error" banner />}
      {/* 信息展示 */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="商品信息" key="1">
          <GoodsDetailForm detail={detail} form={form}></GoodsDetailForm>
        </Tabs.TabPane>
        <Tabs.TabPane tab="投放规则" key="2">
          <RegularDetail detail={detail}></RegularDetail>
        </Tabs.TabPane>
      </Tabs>
      {/* 审核时输入 其他平台价格 */}
      {status == '3' && (
        <FormCondition formItems={formItems} form={form} style={{ marginTop: 10 }}></FormCondition>
      )}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsDetail'],
}))(SpecialGoodDetail);
