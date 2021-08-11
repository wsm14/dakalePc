import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { SQUARE_ICON } from '@/common/imgRatio';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const BrandUpdate = (props) => {
  const { cRef, dispatch, visible = {}, tradeList = [], onClose, loading } = props;

  const { type, show = false, initialValues = {} } = visible;
  const [form] = Form.useForm();

  // 新增/编辑
  const fetchMerBrandSet = () => {
    form.validateFields().then((values) => {
      const { brandLogo, categoryId } = values;
      const { configBrandIdString } = initialValues;
      aliOssUpload(brandLogo).then((res) => {
        dispatch({
          type: {
            add: 'businessBrand/fetchMerBrandAdd',
            edit: 'businessBrand/fetchMerBrandEdit',
          }[type],
          payload: {
            ...values,
            configBrandIdString,
            categoryName: tradeList.filter((item) => item.id === categoryId)[0].categoryName,
            brandLogo: res.toString(),
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: '品牌logo',
      type: 'upload',
      name: 'brandLogo',
      maxFile: 1,
      imgRatio: SQUARE_ICON,
      extra: '限1张，建议尺寸400*400',
    },
    {
      label: '品牌名称',
      name: 'brandName',
      maxLength: 20,
    },
    {
      label: '品牌类型',
      type: 'select',
      name: 'categoryId',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'configBrandIdString' },
    },
  ];

  const modalProps = {
    title: `${{ add: '新增品牌', edit: '编辑品牌' }[type]}`,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={fetchMerBrandSet} loading={loading}>
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
};

export default connect(({ loading, sysTradeList }) => ({
  tradeList: sysTradeList.list.list,
  loading: loading.models.businessBrand,
}))(BrandUpdate);
