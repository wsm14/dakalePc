import React from 'react';
import { connect } from 'umi';
import { Form, Modal } from 'antd';
import FormCondition from '@/components/FormCondition';
import RemainFormList from './RemainFormList';

const RemainModal = (props) => {
  const { visible = {}, onClose, dispatch, loading, childRef } = props;
  const { show = false, detail = {} } = visible;
  const { skuInfoReqs = [], customSize = [] } = detail;

  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      const { skuInfoReqs: stockUpdateReqs = [], remainIncrement } = values;

      const payload = {
        stockUpdateReqs:
          stockUpdateReqs.length > 0
            ? stockUpdateReqs.map((item) => ({
                ownerId: -1,
                goodsCount: item.remain,
                stockId: item.stockId,
              }))
            : [
                {
                  ownerId: -1,
                  goodsCount: remainIncrement,
                  stockId: skuInfoReqs[0]?.stockId,
                },
              ],
      };
      dispatch({
        type: 'electricGoods/fetchAddStock',
        payload,
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: `调整库存`,
      name: 'remainIncrement',
      placeholder: `请输入调整后的库存`,
      extra: `剩余${skuInfoReqs[0]?.remain}`,
      maxLength: 6,
      visible: customSize.length == 0,
      addRules: [
        {
          validator: (rule, value) => {
            if (value && Number(value) > 999999) {
              return Promise.reject('库存量不能超过999999');
            }
            if (value && value == 0) {
              return Promise.reject('库存增量不能为0');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      type: 'noForm',
      visible: customSize.length > 0,
      formItem: <RemainFormList detail={detail} form={form}></RemainFormList>,
    },
  ];

  const modalProps = {
    title: '调整库存',
    visible: show,
    onCancel: onClose,
    onOk: handleOk,
  };
  return (
    <Modal destroyOnClose {...modalProps} loading={loading}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </Modal>
  );
};
export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsAddRemain'],
}))(RemainModal);
