import aliOssUpload from '@/utils/aliOssUpload';
import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const BrandUpdate = (props) => {
  const { cRef, dispatch, visible = {}, onClose } = props;

  const { type, show = false, tradeList = [], initialValues = {} } = visible;
  const [form] = Form.useForm();

  // 新增/编辑
  const fetchMerBrandSet = () => {
    form.validateFields().then((values) => {
      const { brandLogo, categoryId } = values;
      aliOssUpload(brandLogo).then((res) => {
        // initialValues.configBrandIdString 存在为修改 false 为新增
        dispatch({
          type: { add: 'businessBrand/fetchMerBrandAdd', edit: 'businessBrand/fetchMerBrandEdit' }[
            type
          ],
          payload: {
            ...values,
            configBrandIdString: initialValues.configBrandIdString,
            categoryName: tradeList.filter((item) => item.id === categoryId)[0].categoryName,
            brandLogo: res.toString(),
          },
          callback: () =>{ 
            onClose()
            cRef.current.fetchGetData()
          },
        });
      });
    });
  };

  const modalProps = {
    title: `${{ add: '新增品牌', edit: '编辑品牌' }[type]}`,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={fetchMerBrandSet}>
        确定
      </Button>
    ),
  };

  const formItems = [
    {
      label: '品牌logo',
      type: 'upload',
      name: 'brandLogo',
      maxFile: 1,
      isCut: true,
      imgRatio: 50 / 50,
    },
    {
      label: '品牌名',
      name: 'brandName',
      maxLength: 20,
    },
    {
      label: '品牌类型',
      type: 'select',
      name: 'categoryId',
      select: tradeList.map((item) => ({ name: item.categoryName, value: item.id })),
    },
  ];

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
  //   title: '新增品牌',
  //   loadingModels: 'businessBrand',
  //   onFinish: fetchMerBrandSet,
  //   ...props,
  // };
};

export default connect(({ businessBrand, loading }) => ({
  businessBrand,
  loading,
}))(BrandUpdate);
