import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Select, Switch } from 'antd';
import FormCondition from '@/components/FormCondition';

const BusinessAddBeas = (props) => {
  const { dispatch, initialValues = {}, form, loading, brandList, platformList, tradeList } = props;

  const [brandMust, setBrandMust] = useState(!initialValues.otherBrand);
  const [areaMust, setAreaMust] = useState(false);
  const [priceList, setPriceList] = useState([]);

  // 选择商家后搜索商品分类
  const handleSearchBrand = (merchantId) => {
    dispatch({
      type: 'businessList/fetchSearchBrand',
      payload: {
        merchantId,
      },
    });
  };

  // 获取平台服务费
  const fetchGetPlatform = (categoryId) => {
    dispatch({
      type: 'sysTradeList/fetchTradePlatformList',
      payload: {
        categoryId,
      },
    });
  };

  useEffect(() => {
    if (platformList.length)
      if (platformList[0].type === 'no') {
        setPriceList(
          platformList[0].merchantSettleObjects.map((item) => ({
            value: item.serviceFee,
            name: `${item.serviceFee}%`,
          })),
        );
      }
  }, [platformList]);

  const formItems = [
    {
      title: '01 商户信息',
      label: '品牌名称',
      type: 'children',
      rules: 'false',
      required: false,
      children: (
        <>
          <Form.Item name="brand" noStyle rules={[{ required: false, message: '请选择品牌' }]}>
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
      label: '商户简称',
      name: 'activityBseginTime',
      placeholder: '如：一点点城西店',
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'dessioasdn',
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
      label: '店铺门头照',
      name: 'deasddaasdn',
      type: 'upload',
      maxFile: 1,
      extra: '最多上传 1 张图片，建议尺寸1080px*720px，支持JPG、PNG、JPEG格式，大小在2M以内',
      rules: [{ required: true, message: `请确认店铺门头照` }],
    },
    {
      label: '店内实景照',
      name: 'dedasdaaddsdn',
      type: 'upload',
      maxFile: 3,
      extra: '最多上传 3 张图片，建议尺寸1080px*720px，支持JPG、PNG、JPEG格式，大小在2M以内',
      rules: [{ required: true, message: `请确认店内实景照` }],
    },
    {
      label: '经营类目',
      type: 'cascader',
      name: 'description',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'id', children: 'categoryDTOList' },
      onChange: (val) => {
        setPriceList([]);
        setAreaMust(val[0] === 1);
        fetchGetPlatform(val[0]);
        form.setFieldsValue({ dession: undefined });
      },
    },
    {
      label: '店铺面积',
      type: 'select',
      visible: areaMust,
      loading: loading.models.sysTradeList,
      name: 'dessdcription',
      select: platformList.map((item) => ({
        value: item.configMerchantSettleIdString,
        name: item.typeContent,
      })),
      onChange: (val) => {
        form.setFieldsValue({ dession: undefined });
        const plist = platformList.filter((i) => i.configMerchantSettleIdString === val)[0];
        setPriceList(
          plist.merchantSettleObjects.map((item) => ({
            value: item.serviceFee,
            name: `${item.serviceFee}%`,
          })),
        );
      },
    },
    {
      label: '服务费',
      type: 'select',
      name: 'dession',
      loading: loading.models.sysTradeList,
      select: priceList,
    },
  ];

  return <FormCondition formItems={formItems} initialValues={initialValues} form={form} />;
};

export default connect(({ businessList, sysTradeList, loading }) => ({
  loading,
  platformList: sysTradeList.detailList.list,
  brandList: businessList.brandList.list,
  tradeList: sysTradeList.list.list,
}))(BusinessAddBeas);
