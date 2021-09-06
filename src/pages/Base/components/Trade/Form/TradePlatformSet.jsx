import React from 'react';
import { connect } from 'umi';
import { Form, Button, InputNumber } from 'antd';
import { NUM_INT } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const TradePlatformSet = (props) => {
  const { dispatch, childRef, visible, onClose, loading, categoryId } = props;

  const [form] = Form.useForm();
  const { show = false, type = 'areaAdd', detail = {}, configMerchantSettleId, rowData } = visible;

  const propItem = {
    areaAdd: {
      title: `面积新增`,
      payload: {
        categoryId,
        type: 'area',
      },
    },
    areaEdit: {
      title: `面积修改`,
      payload: {
        type: 'area',
        configMerchantSettleId,
      },
    },
    moneySet: {
      title: `服务费设置`,
      name: 'specialService',
      payload: { ...rowData },
    },
  }[type];

  // 提交表单
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      let objdata = {};
      // 新增修改面积
      if (type === 'areaAdd' || type === 'areaEdit') {
        objdata = { typeContent: `${values.areaMin}-${values.areaMax}` };
      } else if (type === 'moneySet') {
        // 新增服务费 rowData 存在则修改
        if (rowData === undefined) {
          objdata = {
            merchantSettleObjects: values,
            type: 'no',
            typeContent: '',
          };
        } else if (configMerchantSettleId) {
          const { merchantSettleObjects: pObj = [] } = rowData;
          objdata = {
            configMerchantSettleId: rowData.configMerchantSettleIdString,
            merchantSettleObjects: [...pObj, values],
          };
        } else {
          // 修改服务费
          const { merchantSettleObjects: pObj = [] } = rowData;
          objdata = {
            configMerchantSettleId: rowData.configMerchantSettleIdString,
            merchantSettleObjects: pObj.map((item) => {
              if (item.serviceFee === detail.serviceFee) {
                return values;
              }
              return item;
            }),
          };
        }
      }
      dispatch({
        type: 'sysTradeList/fetchTradePlatformSet',
        payload: { ...propItem.payload, ...objdata, categoryId },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '面积区间',
      type: 'formItem',
      rules: 'false',
      required: true,
      visible: type !== 'moneySet',
      formItem: (
        <>
          <Form.Item name="areaMin" noStyle rules={[{ required: true, message: '请输入最小面积' }]}>
            <InputNumber min={0} />
          </Form.Item>
          &nbsp;&nbsp;~ &nbsp;&nbsp;
          <Form.Item name="areaMax" noStyle rules={[{ required: true, message: '请输入最大面积' }]}>
            <InputNumber min={0} />
          </Form.Item>
        </>
      ),
    },
    {
      label: '服务费比例',
      name: 'serviceFee',
      addonAfter: '%',
      visible: type === 'moneySet',
      addRules: [{ pattern: NUM_INT, message: '服务费比例应为整数' }],
    },
    {
      label: '赠送卡豆',
      name: 'freeBean',
      addonAfter: '个',
      visible: type === 'moneySet',
      addRules: [{ pattern: NUM_INT, message: '赠送卡豆应为整数' }],
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
}))(TradePlatformSet);
