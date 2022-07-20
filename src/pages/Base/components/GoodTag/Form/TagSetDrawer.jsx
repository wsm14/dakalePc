import React, { useEffect } from 'react';
import { connect } from 'umi';
import { TAG_TYPE, SHOW_TAG_GOODSTYPE } from '@/common/constant';
import { SPACE_PATTERN, ONLY_ENGLISH_PATTERN } from '@/common/regExp';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import BusinessCateFormList from './BusinessCateFormList';

const ClassifySet = (props) => {
  const { dispatch, visible = {}, onClose, cRef, loading, list } = props;
  const { mode = '', detail = {} } = visible;
  const [form] = Form.useForm();

  //获取一级行业类目
  useEffect(() => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  }, [mode]);

  // 确认数据
  const fetchUpData = () => {
    form.validateFields().then((values) => {
      const { configGoodsTagId } = detail;
      dispatch({
        type: {
          add: 'goodsTag/fetchGoodsTagAdd',
          edit: 'goodsTag/fetchGoodsTagUpdate',
        }[mode],
        payload: {
          ...values,
          configGoodsTagId,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '标签类型',
      name: 'tagType',
      type: 'select',
      select: TAG_TYPE,
      disabled: mode === 'edit',
    },
    {
      label: '标签名称',
      name: 'tagName',
      maxLength: 15,
      addRules: [{ pattern: SPACE_PATTERN, message: '不能输入空格' }],
    },
    {
      label: '唯一标识',
      name: 'identification',
      placeholder: '请输入英文',
      addRules: [{ pattern: ONLY_ENGLISH_PATTERN, message: '请输入英文' }],
      extra: '唯一标识只能输入英文，且不可修改',
      visible: detail.tagType === 'show',
      disabled: mode === 'edit',
    },
    {
      label: '关联行业类目',
      type: 'formItem',
      name: 'configGoodsTagCategoryList',
      visible: detail.tagType === 'platform',
      formItem: <BusinessCateFormList form={form} list={list}></BusinessCateFormList>,
    },
    {
      label: '商品类型',
      type: 'radio',
      name: 'goodsType',
      select: SHOW_TAG_GOODSTYPE,
      visible: detail.tagType === 'show',
      disabled: mode === 'edit',
    },
  ];

  const modalProps = {
    title: { add: '新增标签', edit: '编辑标签' }[mode],
    visible: !!mode,
    onClose,
    footer: (
      <Button onClick={fetchUpData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form} initialValues={detail} />
    </DrawerCondition>
  );
};

export default connect(({ loading, sysTradeList }) => ({
  list: sysTradeList.cateList,
  loading: loading.models.goodsTag,
}))(ClassifySet);
