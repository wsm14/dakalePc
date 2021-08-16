import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal, Form, notification } from 'antd';
import debounce from 'lodash/debounce';
import EditorForm from '../../editorForm';
import '../index.less';

/**
 * 选择特惠店铺
 */
const GoodsSelectModal = (props) => {
  const { selectList = [], form, dispatch, visible, onClose, loading } = props;

  const [selectItem, setSelectItem] = useState(null); // 当前选择项

  const [sform] = Form.useForm();

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

  // 获取商家额外信息
  const fetchGetMreInfo = (data, values) => {
    dispatch({
      type: 'activeTemplate/fetchSpecialGoodsSelect',
      payload: {
        ...data,
      },
      callback: (val) => setSelectItem({ ...val, ...values }),
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
        const mreList = form.getFieldValue('list') || [];
        if (mreList.some((i) => i.userMerchantIdString === val)) {
          notification.info({ message: '该店已存在' });
          return;
        }
        console.log(val, op.option.option);
        setSelectItem(op.option.option);
        // fetchGetMreInfo(val, op.option.option);
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
        loading,
        disabled: !selectItem,
      }}
      afterClose={() => setSelectItem(null)}
      onOk={() => {
        const mreList = form.getFieldValue('list') || [];
        form.setFieldsValue({ list: [...mreList, selectItem] });
        onClose();
      }}
      onCancel={onClose}
    >
      <EditorForm form={sform} formItems={formItems}></EditorForm>
    </Modal>
  );
};

export default connect(({ baseData, loading }) => ({
  selectList: baseData.merchantList,
  loading: loading.effects['baseData/fetchGetMerchantsSearch'],
}))(GoodsSelectModal);
