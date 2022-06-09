import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';

// 退货配置
const RefundLocation = (props) => {
  const { visible = {}, onClose, dispatch, loading, form, refundList, setRefundList } = props;
  const { show = false } = visible;

  const [selectLocation, setSelectLocation] = useState([]); // 选中的地址
  const [selectKey, setSelectKey] = useState(''); // 选中的key

  useEffect(() => {
    show && setSelectKey();
  }, [show]);

  const handleOk = () => {
    // form.setFieldsValue({  });
    // setRefundList()
  };

  const searchItems = [
    {
      label: '收件人',
      name: 'goodsName',
    },
    {
      label: '手机号码',
      name: 'status',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '收件人',
      dataIndex: 'merchantName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '省市区',
      dataIndex: 'businessHub',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '详细地址',
      dataIndex: 'topCategoryName',
    },
  ];

  const rowSelection = {
    // preserveSelectedRowKeys: true,
    selectedRowKeys: selectKey,
    onChange: (val, list) => {
      console.log(val, list);
      setSelectKey(val);
      setSelectLocation(list);
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
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ sellType: '0' }}
        rowKey={(record) => `${record.goodsId}`}
        dispatchType="electricGoods/fetchGetList"
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        {...{
          list: [
            {
              goodsId: '1',
              merchantName: 'aaa',
              mobile: '111111',
              businessHub: '110101',
              topCategoryName: 'aadawdawdawda',
            },
            {
              goodsId: '2',
              merchantName: 'bbb',
              mobile: '2332323',
              businessHub: '330109',
              topCategoryName: 'aadawdawdawda',
            },
          ],
        }}
      ></TableDataBlock>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsAddRemain'],
}))(RefundLocation);
