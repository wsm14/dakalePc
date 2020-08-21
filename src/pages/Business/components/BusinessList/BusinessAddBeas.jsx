import React, { useState } from 'react';
import { connect } from 'dva';
import { Form, Select, Switch } from 'antd';
import { PHONE_PATTERN } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';
import QuestionTooltip from '@/components/QuestionTooltip';

const BusinessAddBeas = (props) => {
  const { dispatch, initialValues, form, loading, brandList } = props;

  const [brandMust, setBrandMust] = useState(!initialValues.otherBrand);

  // 选择商家后搜索商品分类
  const handleSearchBrand = (merchantId) => {
    dispatch({
      type: 'businessList/fetchSearchBrand',
      payload: {
        merchantId,
      },
    });
  };

  const formItems = [
    {
      title: '01 商户信息',
      label: '品牌名称',
      type: 'children',
      rules: 'false',
      required: true,
      children: (
        <>
          <Form.Item name="brand" noStyle rules={[{ required: brandMust, message: '请选择品牌' }]}>
            <Select
              showSearch
              placeholder="请搜索并选择你所属的品牌"
              defaultActiveFirstOption={false}
              filterOption={false}
              style={{ width: '70%', marginRight: 10 }}
              disabled={!brandMust}
              onSearch={handleSearchBrand}
            >
              {[{ name: 1, value: 2 }].map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="otherBrand" noStyle valuePropName="checked">
            <Switch
              checkedChildren="其他品牌"
              unCheckedChildren="其他品牌"
              onChange={() => {
                setBrandMust(!brandMust);
                form.setFieldsValue({ brand: undefined });
              }}
            />
          </Form.Item>
        </>
      ),
    },
    {
      label: '商户名称',
      name: 'activityBseginTime',
      placeholder: '请输入营业执照上的名称',
    },
    {
      label: '经营类目',
      type: 'select',
      type: 'cascader',
      name: 'description',
      select: [],
    },
    {
      label: '店铺面积',
      type: 'select',
      name: 'dessdcription',
      select: [2],
    },
    {
      label: '服务费',
      type: 'select',
      name: 'dession',
      select: [3],
    },
    {
      label: '省市区',
      type: 'select',
      type: 'cascader',
      name: 'dessioasdn',
      select: [],
    },
    {
      label: '详细地址',
      name: 'dedn',
    },
    {
      label: '商户电话',
      name: 'dedasdn',
      type: 'number',
    },
    {
      title: '02 联系人信息',
      label: '姓名',
      name: 'dedaasdn',
    },
    {
      label: '手机号',
      name: 'dedaddsdn',
      type: 'number',
      addRules: [{ pattern: PHONE_PATTERN, message: '请填写正确手机号' }],
    },
    {
      title: '03 店铺照片信息',
      label: (
        <QuestionTooltip
          title="店铺门头照"
          type="eye"
          placement="right"
          overlayStyle={{ maxWidth: 350 }}
          content={
            <img
              src="https://resource.dakale.net/image/029C99E2-0E1E-417F-811E-E06C22D622FA.jpg"
              style={{ width: '100%' }}
            ></img>
          }
        />
      ),
      name: 'deasddaasdn',
      type: 'upload',
      maxFile: 1,
      extra: '最多上传 1 张图片，建议尺寸1080px*720px，支持JPG、PNG、JPEG格式，大小在2M以内',
      rules: [{ required: true, message: `请确认店铺门头照` }],
    },
    {
      label: (
        <QuestionTooltip
          title="店内实景照"
          type="eye"
          overlayStyle={{ maxWidth: 350 }}
          placement="right"
          content={
            <img
              src="https://resource.dakale.net/image/029C99E2-0E1E-417F-811E-E06C22D622FA.jpg"
              style={{ width: '100%' }}
            ></img>
          }
        />
      ),
      name: 'dedasdaaddsdn',
      type: 'upload',
      maxFile: 3,
      extra: '最多上传 3 张图片，建议尺寸1080px*720px，支持JPG、PNG、JPEG格式，大小在2M以内',
      rules: [{ required: true, message: `请确认店内实景照` }],
    },
  ];

  return (
    <FormCondition
      formItems={formItems}
      initialValues={initialValues}
      form={form}
      loading={loading}
    />
  );
};

export default connect(({ businessList, loading }) => ({
  brandList: businessList.brandList.list,
  loading: loading.models.businessList,
}))(BusinessAddBeas);
