import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Select, Switch } from 'antd';
import { PHONE_PATTERN } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';

const BusinessAddBeas = (props) => {
  const {
    dispatch,
    amap,
    onSearchAddress,
    initialValues = { provinceCode: [], topCategoryName: ['', ''] },
    form,
    loading,
    brandList,
    platformList,
    tradeList,
  } = props;

  const [brandMust, setBrandMust] = useState(!(initialValues.brandName === '其他品牌'));
  const [areaMust, setAreaMust] = useState(initialValues && initialValues.topCategoryName[0] === 1);
  const [priceList, setPriceList] = useState([]);
  const [selectCity, setSelectCity] = useState(initialValues.provinceCode || []);
  const [ampShow, setAmpShow] = useState(false);
  const [categId, setCategId] = useState(initialValues.businessArea);

  // 获取品牌
  const fetchGetBrandList = () => {
    dispatch({
      type: 'businessBrand/fetchGetList',
      payload: { page: 1, limit: 999 },
    });
  };

  // 获取平台服务费
  const fetchGetPlatform = (categoryId) => {
    dispatch({
      type: 'sysTradeList/fetchTradePlatformList',
      payload: {
        categoryId,
      },
      callback: (val) => {
        // 过滤未设置服务费
        if (!val[0]) {
          setPriceList([]);
        } else if (val[0].type === 'no') {
          setPriceList(
            val[0].merchantSettleObjects.map((item) => ({
              value: item.freeBean,
              name: `${item.serviceFee}%`,
              key: item.serviceFee,
            })),
          );
        } else if (categId && val[0].type !== 'no') {
          const plist = val.filter((i) => i.typeContent === categId)[0];
          setPriceList(
            plist && plist.merchantSettleObjects
              ? plist.merchantSettleObjects.map((item) => ({
                  value: item.freeBean,
                  name: `${item.serviceFee}%`,
                  key: item.serviceFee,
                }))
              : [],
          );
        }
      },
    });
  };

  useEffect(() => {
    fetchGetBrandList();
    if (initialValues) {
      fetchGetPlatform(initialValues.topCategoryName[0]);
    }
  }, []);

  const formItems = [
    {
      title: '01 商户信息',
      label: '品牌名称',
      type: 'children',
      rules: 'false',
      required: false,
      children: (
        <>
          <Form.Item name="brandName" noStyle rules={[{ required: false, message: '请选择品牌' }]}>
            <Select
              showSearch
              placeholder="请搜索或选择所属的品牌"
              defaultActiveFirstOption={false}
              filterOption={false}
              style={{ width: '70%', marginRight: 10 }}
              disabled={!brandMust}
            >
              {brandList.map((item) => (
                <Select.Option key={item.brandName} value={item.brandName}>
                  {item.brandName}
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
                form.setFieldsValue({ brandName: undefined });
              }}
            />
          </Form.Item>
        </>
      ),
    },
    {
      label: '注册帐号',
      name: 'mobile',
      addRules: [{ pattern: PHONE_PATTERN, message: '注册帐号为手机号' }],
    },
    {
      label: '商户简称',
      name: 'merchantName',
      placeholder: '如：一点点城西店',
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'provinceCode',
      onChange: setSelectCity,
    },
    {
      label: '详细地址',
      name: 'address',
      disabled: !selectCity.length,
      onBlur: (e) => onSearchAddress(e.target.value, selectCity, setAmpShow),
    },
    {
      type: 'noForm',
      visible: ampShow,
      children: amap,
    },
    {
      label: '商户电话',
      name: 'telephone',
    },
    {
      label: '店铺门头照',
      name: 'coverImg',
      type: 'upload',
      maxFile: 1,
      extra: '最多上传 1 张图片，建议尺寸1080px*720px，支持JPG、PNG、JPEG格式，大小在2M以内',
      rules: [{ required: true, message: `请确认店铺门头照` }],
    },
    {
      label: '店内实景照',
      name: 'interiorImg',
      type: 'upload',
      maxFile: 5,
      extra:
        '至少上传 3 张图，至多上传 5 张图片，建议尺寸1080px*720px，支持JPG、PNG、JPEG格式，大小在2M以内',
      rules: [{ required: true, message: `请确认店内实景照` }],
      addRules: [
        {
          validator: (rule, value) => {
            const { fileList } = value;
            if (typeof value === 'string') {
              return Promise.resolve();
            }
            if (fileList.length < 3) {
              return Promise.reject('至少上传 3 张图');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '经营类目',
      type: 'cascader',
      name: 'topCategoryName',
      select: tradeList.filter((i) => i.categoryDTOList),
      fieldNames: { label: 'categoryName', value: 'id', children: 'categoryDTOList' },
      onChange: (val) => {
        setPriceList([]);
        setAreaMust(val[0].id === 1);
        fetchGetPlatform(val[0].id);
        form.setFieldsValue({
          categoryName: val,
          businessArea: undefined,
          commissionRatio: undefined,
        });
      },
    },
    {
      label: '经营类目储存',
      name: 'categoryName',
      hidden: true,
    },
    {
      label: '店铺面积',
      type: 'select',
      visible: areaMust,
      loading: loading.models.sysTradeList,
      name: 'businessArea',
      select: platformList.map((item) => ({
        value: item.typeContent,
        name: item.typeContent,
      })),
      onChange: (val) => {
        form.setFieldsValue({ commissionRatio: undefined });
        setCategId(val);
        const plist = platformList.filter((i) => i.typeContent === val)[0];
        setPriceList(
          plist.merchantSettleObjects
            ? plist.merchantSettleObjects.map((item) => ({
                value: item.freeBean,
                name: `${item.serviceFee}%`,
                key: item.serviceFee,
              }))
            : [],
        );
      },
    },
    {
      label: '服务费',
      type: 'select',
      name: 'commissionRatio',
      disabled: loading.models.sysTradeList,
      loading: loading.models.sysTradeList,
      select: priceList,
      onChange: (val, row) => form.setFieldsValue({ bondBean: row }),
    },
    {
      label: '赠送卡豆数',
      name: 'bondBean',
      hidden: true,
    },
  ];

  return <FormCondition formItems={formItems} initialValues={initialValues} form={form} />;
};

export default connect(({ businessBrand, sysTradeList, loading }) => ({
  loading,
  platformList: sysTradeList.platFormList.list,
  brandList: businessBrand.list,
  tradeList: sysTradeList.list.list,
}))(BusinessAddBeas);
