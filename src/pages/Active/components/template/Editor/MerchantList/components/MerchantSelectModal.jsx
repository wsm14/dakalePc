import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import '../index.less';

/**
 * 选择特惠店铺
 */
const GoodsSelectModal = (props) => {
  const { specialGoodsList = {}, form, dispatch, visible, onClose, loading } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项
  const [tabKey, setTabKey] = useState('goods'); // tab类型

  useEffect(() => {
    if (visible) {
      if (tabKey === 'goods') {
        setSelectItem(form.getFieldValue('list') || []);
      }
    }
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '选择店铺',
      name: 'ownerId',
      type: 'merchant',
      col: false,
    },
  ];

  // 获取特惠活动
  const fetchSpecialGoodsList = (data) => {
    if (!data.ownerId) return;
    dispatch({
      type: 'activeTemplate/fetchSpecialGoodsSelect',
      payload: {
        ...data,
        page: 1,
        limit: 999,
      },
    });
  };

  return (
    <Modal
      title={`选择店铺`}
      width={500}
      visible={visible}
      afterClose={() => setTabKey('goods')}
      bodyStyle={{ overflowY: 'auto', maxHeight: 500 }}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem.length,
      }}
      onOk={() => {
        form.setFieldsValue({ list: selectItem });
        onClose();
      }}
      onCancel={onClose}
    ></Modal>
  );
};

export default connect(({ activeTemplate, loading }) => ({
  specialGoodsList: activeTemplate.specialGoods,
  loading,
}))(GoodsSelectModal);
