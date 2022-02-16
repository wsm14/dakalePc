import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const TradeBaseSet = (props) => {
  const {
    dispatch,
    childRef,
    visible,
    onClose,
    loading,
    detailList,
    type: eidtType,
    categoryId,
  } = props;

  const [form] = Form.useForm();
  const { show = false, detail = {} } = visible;

  const listData = detailList.list.map((item) => item.name);

  const propItem = {
    base: {
      title: `基础设施`,
      name: 'infrastructures',
      url: 'sysTradeList/fetchTradeBaseSet',
    },
    special: {
      title: `特色服务`,
      name: 'specialService',
      url: 'sysTradeList/fetchTradeSpecialSet',
    },
  }[eidtType];

  // 提交表单
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      const payload = !Object.keys(detail).length
        ? [...listData, values.name]
        : listData.map((item) => {
            if (item === detail.name) {
              return values.name;
            }
            return item;
          });
      dispatch({
        type: propItem.url,
        payload: {
          [propItem.name]: payload,
          categoryId,
          configMerchantSettleId: detail.configMerchantSettleIdString,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: `${propItem.title}名称`,
      name: 'name',
      maxLength: 10,
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: `设置 - ${propItem.title}`,
    visible: show,
    onClose,
    footer: (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        提交
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['sysTradeList/fetchTradeBaseSet'] ||
    loading.effects['sysTradeList/fetchTradeSpecialSet'],
}))(TradeBaseSet);
