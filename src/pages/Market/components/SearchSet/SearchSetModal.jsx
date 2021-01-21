import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Form, Alert } from 'antd';
import FormCondition from '@/components/FormCondition';

const SearchSetModal = (props) => {
  const { loading, dispatch, visible = false, onCancel } = props;
  const { show = false, detail = [], data = {} } = visible;

  const [form] = Form.useForm();
  const [selectMre, setSelecMre] = useState([]);

  useEffect(() => {
    show && setSelecMre(detail);
  }, [detail]);

  // 勾选的行业设置
  const handleSetTradeSelect = () => {
    const data = form.getFieldValue('data');
    let extraParam = [];
    if (data.length) {
      extraParam = selectMre
        .filter((item) => data.indexOf(item.value) > -1)
        .map((item) => ({ merchantName: item.label, rankStatus: 1 }));
    }
    dispatch({
      type: 'searchSet/fetchSearchSet',
      payload: {
        extraParam: JSON.stringify({ merchantList: extraParam }),
      },
      callback: onCancel,
    });
  };

  // 设置标签
  const handleTagSet = (val) => {
    const obj = {};
    const arr = [...selectMre, ...detail, { value: val, label: val }].reduce((item, next) => {
      obj[next.value] ? '' : (obj[next.value] = true && item.push(next));
      return item;
    }, []);
    form.setFieldsValue({ data: arr.map((i) => i.value) });
    setSelecMre(arr);
  };

  const formItems = [
    {
      label: '关键词',
      name: 'merchantList',
      rules: [{ required: false }],
      onPressEnter: (e) => handleTagSet(e.target.value),
      addonAfter: (
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => handleTagSet(form.getFieldValue('merchantList'))}
        >
          添加
        </span>
      ),
    },
    {
      label: '已选项目',
      name: 'data',
      type: 'checkbox',
      select: selectMre,
      rules: [{ required: false }],
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
      maskClosable={false}
      bodyStyle={{ padding: '0 0 24px' }}
    >
      <Alert message="展示搜索页面-热门搜索模块" banner style={{ marginBottom: 20 }} />
      <div style={{ padding: '0 50px 0 0' }}>
        <FormCondition formItems={formItems} form={form} initialValues={data} />
      </div>
    </Modal>
  );
};

export default connect(({ businessList, loading }) => ({
  selectList: businessList.selectList,
  loading,
}))(SearchSetModal);
