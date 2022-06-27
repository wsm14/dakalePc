import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Form, InputNumber } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';

const FormItemInput = ({ name, label = '', rules = [], inputProps = {} }) => {
  return (
    <Form.Item
      label=""
      name={name}
      style={{ marginBottom: 0 }}
      rules={[{ required: true, message: `请输入${label}` }, ...rules]}
    >
      <InputNumber
        min={0}
        precision={0}
        style={{ width: 100 }}
        placeholder="请输入"
        {...inputProps}
      ></InputNumber>
    </Form.Item>
  );
};

// 修改电商品库存
const EditCGoodsRemainModal = (props) => {
  const { visible, dispatch, tableRef, onClose, loading } = props;
  const { show = false, detail = {} } = visible;
  const { payType, marketingActivityId, ownerId, goodsId, goodsName, skuList } = detail;

  const [form] = Form.useForm();

  useEffect(() => {
    show && form.setFieldsValue({ skuList });
  }, [show]);

  // 修改库存
  const fetchUpdateRemain = () => {
    form.validateFields().then((values) => {
      const { skuList: sList } = values;
      dispatch({
        type: 'marketActivity/fetchMarketActivityGoodsEditRemain',
        payload: {
          marketingActivityId,
          ownerId,
          goodsId,
          skuList: sList.map(({ skuId, activityRemain }) => ({
            skuId,
            activityTotal: activityRemain,
          })),
        },
        callback: () => {
          onClose();
          tableRef.current.fetchGetData();
        },
      });
    });
  };

  // table 表头
  const getColumns = [
    {
      title: 'SKU码',
      dataIndex: 'skuCode',
    },
    {
      title: '规格值',
      dataIndex: 'relationAttributeObjects',
      render: (val) => val?.map((i) => `${i.name}:${i.value}`).join('\n') || '',
    },
    {
      title: '活动售价（卡豆）',
      align: 'right',
      dataIndex: 'activitySellBean',
      show: payType == 'self',
    },
    {
      title: '活动零售价',
      align: 'right',
      dataIndex: 'activitySellPrice',
      render: (val, row) => `￥${val || 0}`,
    },
    {
      title: '活动库存',
      align: 'right',
      dataIndex: 'activityRemain',
      render: (val, row, rowIndex) => (
        <FormItemInput label="活动折扣" name={[rowIndex, 'activityRemain']}></FormItemInput>
      ),
    },
  ];

  return (
    <Modal
      title={goodsName}
      width={800}
      destroyOnClose
      visible={show}
      zIndex={100}
      confirmLoading={loading}
      onOk={() => {
        fetchUpdateRemain();
      }}
      onCancel={onClose}
    >
      <Form form={form}>
        <Form.List name={'skuList'}>
          {(fields) => (
            <TableDataBlock
              key={fields.key}
              list={skuList}
              noCard={false}
              tableSize="small"
              pagination={false}
              columns={getColumns}
              rowKey={(record) => `${record.skuId}`}
            ></TableDataBlock>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['marketActivity/fetchMarketActivityGoodsEditRemain'],
}))(EditCGoodsRemainModal);
