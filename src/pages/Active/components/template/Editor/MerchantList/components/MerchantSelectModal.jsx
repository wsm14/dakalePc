import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import debounce from 'lodash/debounce';
import EditorForm from '../../editorForm';
import '../index.less';

/**
 * 选择特惠店铺
 */
const GoodsSelectModal = (props) => {
  const { selectList = [], form, dispatch, visible, onClose, loading } = props;

  const [selectItem, setSelectItem] = useState([]); // 当前选择项

  useEffect(() => {
    if (visible) {
      setSelectItem(form.getFieldValue('list') || []);
    }
  }, [visible]);

  // 搜索店铺
  const fetchGetMre = debounce((content) => {
    if (!content.replace(/'/g, '') || content.replace(/'/g, '').length < 2) return;
    dispatch({
      type: 'baseData/fetchGetMerchantsSearch',
      payload: {
        content: content.replace(/'/g, ''),
      },
    });
  }, 500);

  // 获取商家统计信息
  const fetchGetMreInfo = (data) => {
    dispatch({
      type: 'activeTemplate/fetchSpecialGoodsSelect',
      payload: {
        ...data,
      },
    });
  };

  // 搜索参数
  const formItems = [
    {
      label: '商家名称',
      name: 'merchantId',
      type: 'select',
      loading,
      onSearch: fetchGetMre,
      onChange: (val, op) => {
        console.log(val, op.option.option);
        // handleStoreGoodsType(val);
      },
      select: selectList,
    },
  ];

  return (
    <Modal
      title={`选择店铺`}
      width={500}
      visible={visible}
      destroyOnClose
      okButtonProps={{
        disabled: !selectItem.length,
      }}
      onOk={() => {
        form.setFieldsValue({ list: selectItem });
        onClose();
      }}
      onCancel={onClose}
    >
      <EditorForm form={form} formItems={formItems}></EditorForm>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  selectList: baseData.merchantList,
  loading: loading.effects['baseData/fetchGetMerchantsSearch'],
}))(GoodsSelectModal);
