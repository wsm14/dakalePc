import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';

// 退货配置
const RefundLocation = (props) => {
  const { visible = {}, onClose, loading, form, setRefundList } = props;
  const { show = false, list = [] } = visible;

  const [selectLocation, setSelectLocation] = useState({}); // 选中的地址

  const handleOk = () => {
    const obj = form.getFieldValue('returnRuleObject');
    form.setFieldsValue({
      returnRuleObject: {
        ...obj,
        ...selectLocation,
      },
    });
    setRefundList(selectLocation);
    onClose();
  };

  // const searchItems = [
  //   {
  //     label: '收货人',
  //     name: 'goodsName',
  //   },
  //   {
  //     label: '手机号码',
  //     name: 'status',
  //   },
  // ];

  // table 表头
  const getColumns = [
    {
      title: '收货人',
      dataIndex: 'addressName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '省市区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
    },
  ];

  const rowSelection = {
    onChange: (val, list) => {
      const { addressName, ...other } = list[0];
      setSelectLocation({
        name: addressName,
        ...other,
      });
    },
  };

  const modalProps = {
    title: '选择退货地址',
    visible: show,
    width: 800,
    onCancel: onClose,
    onOk: handleOk,
  };
  return (
    <Modal destroyOnClose {...modalProps} loading={loading}>
      <TableDataBlock
        noCard={false}
        columns={getColumns}
        // searchItems={searchItems}
        rowKey={(record, index) => `${record.address}${index}`}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        list={list}
        total={list.length}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsAddRemain'],
}))(RefundLocation);
