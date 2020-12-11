import React, { useState } from 'react';
import { connect } from 'dva';
import { Modal, Form, Alert } from 'antd';
import debounce from 'lodash/debounce';
import FormCondition from '@/components/FormCondition';

const SearchSetModal = (props) => {
  const { loading, dispatch, visible = false, businessList, onCancel } = props;
  const { show = false } = visible;

  const [form] = Form.useForm();
  const [selectMre, setSelecMre] = useState([]);

  // 勾选的行业设置
  const handleSetTradeSelect = () => {
    dispatch({
      type: 'searchSet/fetchSearchSet',
      payload: {
        extraParam: JSON.stringify({ merchantList: selectMre }),
      },
      callback: onCancel,
    });
  };

  // 搜索商户
  const fetchGetMreList = debounce((merchantName) => {
    if (!merchantName) return;
    dispatch({
      type: 'businessList/fetchGetList',
      payload: {
        merchantName,
        businessStatus: 1,
        status: 1,
        page: 1,
        limit: 999,
      },
    });
  }, 500);

  console.log(businessList);

  const formItems = [
    {
      label: '关键词',
      name: 'merchantList',
      type: 'select',
      mode: 'multiple',
      loading: loading.effects['businessList/fetchGetList'],
      onSearch: fetchGetMreList,
      select: businessList.list.map((item) => ({
        name: item.merchantName,
        value: item.userMerchantIdString,
      })),
      onChange: (val, item) =>
        setSelecMre(
          item.map((mre) => ({
            merchantName: mre.children[0],
            id: mre.value,
            rankStatus: 1,
          })),
        ),
    },
  ];

  return (
    <Modal
      title={'行业设置'}
      width={650}
      destroyOnClose
      visible={show}
      confirmLoading={loading.effects['searchSet/fetchSearchSet']}
      onOk={handleSetTradeSelect}
      onCancel={onCancel}
      bodyStyle={{ padding: '0 0 24px' }}
    >
      <Alert message="展示搜索页面-热门搜索模块" banner style={{ marginBottom: 20 }} />
      <div style={{ padding: '0 50px 0 0' }}>
        <FormCondition formItems={formItems} form={form} />
      </div>
    </Modal>
  );
};

export default connect(({ businessList, loading }) => ({
  businessList,
  loading,
}))(SearchSetModal);
