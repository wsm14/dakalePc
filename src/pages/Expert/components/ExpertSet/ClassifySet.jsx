import aliOssUpload from '@/utils/aliOssUpload';
import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const ClassifySet = (props) => {
  const { dispatch, childRef, visible = {}, onClose } = props;

  const { type, show = false, initialValues = {}, tradeList = [], rowDetail = {} } = visible;

  const [form] = Form.useForm();

  // 经营类目储存
  let setData = {};
  const editType = !initialValues.domainId;

  // 提交表单
  const fetchDataEdit = () => {
    form.validateFields().then((values) => {
      const { domainImage = '' } = values;
      const { parentDomainId: pid } = initialValues;
      const topCategoryId = pid == 0 ? setData.value : setData[0].categoryIdString;
      const topCategoryName =
        pid == 0 ? setData.children && setData.children[0] : setData[0].categoryName;
      const category = {
        categoryNode:
          pid == 0
            ? `${topCategoryId}.${topCategoryId}`
            : `${topCategoryId}.${setData[1].categoryIdString}`,
        topCategoryId,
        topCategoryName,
        categoryId: pid == 0 ? topCategoryId : setData[1].categoryIdString,
        categoryName: pid == 0 ? topCategoryName : setData[1].categoryName,
      };
      aliOssUpload(domainImage).then((res) => {
        dispatch({
          type: { true: 'expertSet/fetchExpertAdd', false: 'expertSet/fetchClassifyEdit' }[
            editType
          ],
          payload: { ...initialValues, ...values, ...category, domainImage: res.toString() },
          callback: () => {
            onClose();
            childRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: '行业类目',
      type: 'select',
      name: 'topCategoryName',
      disabled: rowDetail.topCategoryName,
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString' },
      visible: initialValues.parentDomainId == 0,
      onChange: (val, item) => {
        setData = item;
      },
    },
    {
      label: '领域名称',
      visible: initialValues.parentDomainId == 0,
      name: 'domainName',
    },
    {
      label: '领域',
      visible: initialValues.parentDomainId !== 0 && !!initialValues.parentDomainId,
      name: 'domainNameShow',
      disabled: true,
    },
    {
      label: '内容分类',
      visible: initialValues.parentDomainId !== 0,
      name: 'domainName',
      maxLength: 4,
    },
    {
      label: `图片`,
      type: 'upload',
      name: 'domainImage',
      maxFile: 1,
    },
    {
      label: '行业类目',
      type: 'cascader',
      name: 'category',
      select: tradeList.filter(
        (i) => i.categoryDTOList && rowDetail && rowDetail.topCategoryId == i.categoryIdString,
      ),
      visible: initialValues.parentDomainId !== 0,
      fieldNames: {
        label: 'categoryName',
        value: 'categoryIdString',
        children: 'categoryDTOList',
      },
      onChange: (val) => {
        setData = val;
      },
    },
  ];

  const modalProps = {
    title: `${!initialValues.domainId ? '新增' : '修改'}`,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={fetchDataEdit}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </DrawerCondition>
  );

  // return {
  //   type: 'Drawer',
  //   showType: 'form',
  //   title: `${!initialValues.domainId ? '新增' : '修改'}`,
  //   loadingModels: 'expertSet',
  //   initialValues,
  //   onFinish: fetchDataEdit,
  //   ...props,
  // };
};

export default connect(({ expertSet, loading }) => ({
  expertSet,
  loading,
}))(ClassifySet);
