import React, { useEffect } from 'react';
import { connect } from 'umi';
import { TAG_TYPE } from '@/common/constant';
import { SPACE_PATTERN } from '@/common/regExp';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import BusinessCateFormList from '@/components/BusinessCateFormList/index';

const ClassifySet = (props) => {
  const { dispatch, visible = {}, onClose, cRef, loading, list } = props;
  const { type = '', detail = {}, tabkey } = visible;
  const [form] = Form.useForm();
  if (!detail.tagType) {
    detail.tagType = tabkey;
  }

  //获取一级行业类目
  useEffect(() => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  }, [type]);

  // 确认数据
  const fetchUpData = () => {
    form.validateFields().then((values) => {
      const { configGoodsTagId } = detail;
      const { configGoodsTagCategoryList = [] } = values;
      let temObj = {};
      //去除重复的行业类目
      const noRepetCateArr = configGoodsTagCategoryList.reduce(function (item, next) {
        temObj[next.categoryId] ? '' : (temObj[next.categoryId] = true && item.push(next));
        return item;
      }, []);

      dispatch({
        type: {
          add: 'goodsTag/fetchGoodsTagAdd',
          edit: 'goodsTag/fetchGoodsTagUpdate',
        }[type],
        payload: {
          ...values,
          configGoodsTagId: configGoodsTagId,
          configGoodsTagCategoryList: noRepetCateArr,
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
    },
    {
      label: '标签名称',
      name: 'tagName',
      maxLength: 15,
      addRules: [{ pattern: SPACE_PATTERN, message: '不能输入空格' }],
    },
    {
      label: '关联行业类目',
      type: 'formItem',
      name: 'configGoodsTagCategoryList',
      formItem: <BusinessCateFormList form={form} list={list}></BusinessCateFormList>,
    },
  ];

  const modalProps = {
    title: { add: '新增标签', edit: '编辑标签' }[type],
    visible: !!type,
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
