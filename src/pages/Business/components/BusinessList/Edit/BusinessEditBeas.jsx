import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
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
    categId,
    setCategId,
    setType, // 进入的状态 add edit audit
  } = props;

  const [brandMust, setBrandMust] = useState(!(initialValues.brandName === '其他品牌'));
  const [selectCity, setSelectCity] = useState(initialValues.provinceCode || []);
  const [ampShow, setAmpShow] = useState(false);
  const [hubList, setHubList] = useState([]);

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
    });
  };

  // 获取推广费
  const fetchGetPromotionMoney = (categoryId) => {
    dispatch({
      type: 'sysTradeList/fetchPromotionMoneyGet',
      payload: { categoryId },
      callback: (val) => form.setFieldsValue({ promotionFee: val.promotionFee || 0 }),
    });
  };

  // 获取详情
  const fetchGetDetail = (payload) => {
    dispatch({
      type: 'businessAudit/fetchWaitBusinessHub',
      payload,
      callback: (info) => setHubList(info),
    });
  };

  useEffect(() => {
    fetchGetBrandList();
    if (initialValues) {
      setAmpShow(!!initialValues.lat);
      fetchGetPlatform(initialValues.topCategoryId);
      setAmpShow(!!initialValues.lat);
      if (initialValues.districtCode) fetchGetDetail({ districtCode: initialValues.districtCode });
      setType === 'audit' && fetchGetPromotionMoney(initialValues.topCategoryId);
    }
  }, []);

  const formItems = [
    {
      title: '01 店铺信息',
      label: '品牌名称',
      type: 'formItem',
      rules: 'false',
      required: false,
      formItem: (
        <>
          <Form.Item
            key="bandName"
            name="brandName"
            noStyle
            rules={[{ required: false, message: '请选择品牌' }]}
          >
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
          <Form.Item key="otherBrand" name="otherBrand" noStyle valuePropName="checked">
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
      visible: setType != 'edit',
      addRules: [{ pattern: PHONE_PATTERN, message: '注册帐号为手机号' }],
    },
    {
      label: '店铺简称',
      name: 'merchantName',
      placeholder: '如：一点点城西店',
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'provinceCode',
      onChange: (val, option) => {
        fetchGetDetail({ districtCode: option[2].value });
        setSelectCity(option);
        form.setFieldsValue({
          businessHubIdString: undefined,
        });
      },
    },
    {
      label: '所属商圈',
      name: 'businessHubIdString',
      type: 'select',
      select: hubList,
      fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
      span: 2,
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
      formItem: amap,
    },
    {
      label: '店铺电话',
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
      multiple: true,
      maxFile: 5,
      extra:
        '至少上传 3 张图，至多上传 5 张图片，建议尺寸1080px*720px，支持JPG、PNG、JPEG格式，大小在2M以内',
      rules: [{ required: true, message: `请确认店内实景照` }],
      addRules: [
        {
          validator: (rule, value) => {
            if (typeof value === 'string') {
              return Promise.resolve();
            }
            if (!value) {
              return Promise.resolve();
            }
            const { fileList } = value;
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
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      onChange: (val, option) => {
        const [categoryId] = val;
        setCategId(categoryId);
        fetchGetPlatform(categoryId);
        fetchGetPromotionMoney(categoryId);
        form.setFieldsValue({
          categoryName: option,
          businessArea: undefined,
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
      name: 'businessArea',
      visible: categId && platformList.length && platformList[0].type === 'area',
      loading: loading.models.sysTradeList,
      select: platformList,
      fieldNames: { label: 'typeContent', value: 'typeContent' },
      onChange: (val) => {
        form.setFieldsValue({ commissionRatio: undefined });
      },
    },
    {
      label: '推广费比例',
      name: 'promotionFee',
      loading: loading.models.sysTradeList,
      suffix: '%',
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
