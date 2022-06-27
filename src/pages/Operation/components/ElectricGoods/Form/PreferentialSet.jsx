import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { Button, InputNumber } from 'antd';
import CITYJSON from '@/common/city';
import {
  ELECTRIC_GOODS_COMMISSION,
  ELECTRICGOODS_SELL_STATUS,
  ELECTRICGOODS_SKU,
  ELECTRICGOODS_SELL_PRICE_TYPE,
  FRONT_SHOW_TYPE,
  FRONT_SHOW_TYPE_FREE,
  FREIGHT_TYPE,
  SETTLE_TYPE,
  ASTRICT_BUY,
} from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import EditorForm from '@/components/EditorForm';
import FormCondition from '@/components/FormCondition';
import Shipping from './Shipping';
import RefundLocation from './RefundLocation';
import AddSpecification from './Specification/AddSpecification';
import SpecificationList from './Specification/SpecificationList';
import TieredPricing from './Specification/TieredPricing';
import styles from './style.less';

const PreferentialSet = ({
  form,
  editActive,
  loadings,
  dispatch,
  commissionShow,
  setCommissionShow,
  initialValues = {},
  setContent,
  classifyParentList, // 电商品后台类目列表
  brandList, // 供应商品牌列表
  tagsPlatform, // 获取平台商品标签
}) => {
  // 是否 editActive = 'againUp' || 'again' || 'edit'三种都隐藏的数据
  const commonDisabled = ['againUp', 'again', 'edit'].includes(editActive);
  //活动中隐藏的编辑项//edit 独有不展示
  const editDisabled = ['edit'].includes(editActive);
  const againUpDisabled = ['edit', 'againUp'].includes(editActive);

  const [first, setFirst] = useState(false); // 第一次不重置数据 否则会有数据回显问题
  const [manualList, setManualList] = useState([]); // 分佣模版字段
  const [supplierSelect, setSupplierSelect] = useState([]); // 供应商列表
  // const [settlerSelect, setSettlerSelect] = useState([]); // 结算供应商列表
  // const [settleType, setSettleType] = useState('admin'); // 结算人类型
  const [sellType, setSellType] = useState('single'); // 售卖类型
  const [priceType, setPriceType] = useState('defaultMode'); // 售卖价格类型
  const [freightType, setFreightType] = useState('free'); // 运费类型
  const [visibleRefund, setVisibleRefund] = useState(false); // 退货地址modal
  const [refundList, setRefundList] = useState([]); // 退货地址数据暂存
  const [refundAllData, setRefundAllData] = useState([]); // 供应商详情数据-退货地址用
  const [specificationTypeData, setSpecificationTypeData] = useState([]); // 规格类型数据暂存
  const [tieredModal, setTieredModal] = useState(false); // 设置阶梯价model
  const [AstrictType, setAstrictType] = useState('unlimited'); // 限购状态

  // 是否是多规格
  const specificationDisabled = specificationTypeData.length > 0;

  const {
    customSize = [],
    relateId,
    categoryNode,
    sellType: sellTypes,
    paymentModeType,
    postageRuleObject,
    buyLimitRuleObject,
    returnRuleObject,
  } = initialValues;

  useEffect(() => {
    getTags();
    if (editActive != 'add') {
      setSpecificationTypeData(customSize); // 回显规格类型
      fetchGetSearchSupplier({ supplierId: relateId }); // 回显供应商
      fetchBrandIdList(relateId); // 回显品牌
      getCommissionFlag(categoryNode[0]); // 获取分佣模板
      setSellType(sellTypes); // 回显售卖类型
      setPriceType(paymentModeType); // 回显售卖价格类型
      setFreightType(postageRuleObject.type); // 回显运费类型
      setAstrictType(buyLimitRuleObject.type); // 回显限购状态
      setRefundList(returnRuleObject);
    }
    // 延迟赋值: skuInfoReqs 详细规格组件使用
    setTimeout(() => {
      setFirst(true);
    }, 200);
  }, []);

  // 批采价数组   为判断设置状态
  const batchList = form.getFieldValue('batchLadderObjects') || [];

  // 处理规格组数据
  useEffect(() => {
    const newArr = specificationTypeData.map((item) =>
      (item?.value || []).map((i) => ({
        [item.name]: i,
      })),
    );
    if (first) {
      form.setFieldsValue({ skuInfoReqs: doExchange(newArr), customSize: specificationTypeData });
    }
  }, [specificationTypeData]);

  // 处理规格组数据
  const doExchange = (arr = []) => {
    let len = arr.length;
    // 当数组大于等于2个的时候
    if (len >= 2) {
      // 第一个数组的长度
      let len1 = arr[0].length;
      // 第二个数组的长度
      let len2 = arr[1].length;
      // 2个数组产生的组合数
      let lenBoth = len1 * len2;
      //  申明一个新数组,做数据暂存
      let items = new Array(lenBoth);
      // 申明新数组的索引
      let index = 0;
      // 2层嵌套循环,将组合放到新数组中
      for (let i = 0; i < len1; i++) {
        for (let j = 0; j < len2; j++) {
          items[index] = { ...arr[0][i], ...arr[1][j] };
          index++;
        }
      }
      // 将新组合的数组并到原数组中
      let newArr = new Array(len - 1);
      for (let i = 2; i < arr.length; i++) {
        newArr[i - 1] = arr[i];
      }
      newArr[0] = items;
      // 执行回调
      return doExchange(newArr);
    } else {
      return (arr[0] || []).map((item) => ({
        attributes: Object.keys(item).map((name) => ({ name, value: item[name] })),
      }));
    }
  };

  // 搜索供应商
  const fetchGetSearchSupplier = debounce((content, type) => {
    // if (!content.replace(/'/g, '')) return;
    dispatch({
      type: 'baseData/fetchSearchSupplierManage',
      payload: {
        ...content,
      },
      callback: (val) => {
        // if (type === 'all') {
        setSupplierSelect(val);
        // }
        // setSettlerSelect(val);
      },
    });
  }, 500);

  // 搜索品牌列表  + 搜索供应商详情退货地址列表
  const fetchBrandIdList = (supplierId = '') => {
    if (typeof supplierId != 'string') return;
    // form.setFieldsValue({
    //   settleInfoReq: {
    //     settlerId: supplierId,
    //   },
    // });
    dispatch({
      type: 'baseData/fetchSupplierBrandList',
      payload: { supplierId },
    });
    dispatch({
      type: 'supplierManage/fetchGetSupplierManageDetail',
      payload: { supplierId },
      callback: (detail) => {
        const { logisticList = [] } = detail;
        setRefundAllData(logisticList);
      },
    });
  };

  //sku通用-是否需要设置佣金
  const getCommissionFlag = (categoryId) => {
    dispatch({
      type: 'baseData/fetchGoodsIsCommission',
      payload: {
        serviceType: 'commerceGoods',
        categoryId: categoryId,
      },
      callback: ({ manuallyFlag, manualDivisions }) => {
        setCommissionShow(manuallyFlag);
        setManualList(manualDivisions || []);
      },
    });
  };

  //获取平台商品标签
  const getTags = () => {
    dispatch({ type: 'baseData/fetchGoodsTagList' });
  };

  // 退货地址描述列表
  const descriptionsItems = [
    {
      label: '收货人',
      name: 'name',
    },
    {
      label: '手机号码',
      name: 'mobile',
    },
    {
      label: '所在地区',
      name: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      label: '详细地址',
      name: 'address',
    },
  ];

  // 信息
  const formItems = [
    {
      title: '选择供应商',
      label: '供应商',
      name: 'relateId',
      type: 'select',
      select: supplierSelect,
      loading: loadings.models.baseData,
      onSearch: (val) => fetchGetSearchSupplier({ name: val.replace(/'/g, '') }, 'all'),
      onSelect: (val) => {
        fetchBrandIdList(val);
      },
      disabled: againUpDisabled,
    },
    {
      title: '商品信息',
      label: '商品类目',
      name: 'categoryNode',
      type: 'cascader',
      select: classifyParentList,
      fieldNames: { label: 'classifyName', value: 'classifyId', children: 'childList' },
      onChange: (val, option) => {
        getCommissionFlag(val[0]);
      },
      disabled: editDisabled,
    },
    {
      label: '商品编码',
      name: 'goodsCode',
      maxLength: 32,
      extra: '用于商家内部管理所使用的自定义简易编码',
      rules: [{ required: false }],
    },
    {
      label: '商品名称',
      name: 'goodsName',
      type: 'textArea',
      maxLength: 80,
    },
    {
      label: '品牌',
      name: 'brandId',
      type: 'select',
      select: brandList,
      rules: [{ required: false }],
    },
    {
      label: '商品轮播图',
      name: 'goodsBriefImg',
      type: 'upload',
      maxFile: 5,
      extra: '限5张，第一张为主图，建议上传5:4比例的图片/视频；可以拖拽图片调整前后顺序。',
    },
    {
      title: '销售信息',
      label: '售卖类型',
      name: 'sellType',
      type: 'radio',
      select: ELECTRICGOODS_SELL_STATUS,
      onChange: (e) => {
        setSellType(e.target.value);
        if (e.target.value == 'batch') {
          form.setFieldsValue({
            paymentModeType: 'defaultMode',
          });
        }
      },
      disabled: againUpDisabled,
    },
    {
      label: '库存单位',
      name: 'stockUnit',
      type: 'select',
      select: ELECTRICGOODS_SKU,
      disabled: editDisabled,
    },
    {
      label: '规格设置',
      name: 'customSize',
      type: 'formItem',
      formItem: (
        <AddSpecification
          form={form}
          disabled={commissionShow == '1' || editDisabled}
          specificationTypeData={specificationTypeData}
          setSpecificationTypeData={setSpecificationTypeData}
        ></AddSpecification>
      ),
      extra: '如有颜色、尺码等多种规格，请添加商品规格。',
    },
    {
      label: '原价',
      name: 'oriPrice',
      type: 'number',
      addonBefore: '￥',
      min: 0,
      precision: 2,
      visible: !specificationDisabled,
      extra: '用于指导售价调整和为消费者提供的一个参考价，如服装的吊牌价',
      disabled: editDisabled,
    },
    {
      label: '成本价',
      name: 'costPrice',
      type: 'number',
      addonBefore: '￥',
      min: 0,
      precision: 2,
      visible: !specificationDisabled && sellType == 'single',
      extra: '用于平台采买商品时记录成本',
      rules: [{ required: false }],
    },
    {
      label: '结算价',
      name: 'settlePrice',
      type: 'number',
      addonBefore: '￥',
      min: 0,
      precision: 2,
      visible: !specificationDisabled && sellType != 'batch',
      extra: '指供应商/店铺和哒卡乐平台的结算价',
      disabled: editDisabled,
    },
    {
      label: '最小起订量',
      name: 'minPurchaseNum',
      type: 'number',
      min: 0,
      precision: 0,
      visible: !specificationDisabled && sellType != 'single',
    },
    {
      label: '批采价',
      name: 'batchLadderObjects',
      type: 'formItem',
      visible: !specificationDisabled && sellType != 'single',
      formItem: (
        <Button type="link" onClick={() => setTieredModal(true)}>
          {batchList.length > 0 ? '已设置' : '设置'}
        </Button>
      ),
    },
    {
      label: '售卖价格类型',
      name: 'paymentModeType',
      type: 'radio',
      hidden: sellType == 'batch',
      select: ELECTRICGOODS_SELL_PRICE_TYPE,
      onChange: (e) => {
        setPriceType(e.target.value);
        form.setFieldsValue({ displayType: undefined });
      },
      disabled: editDisabled,
    },
    {
      // name:'skuInfoReqs'
      type: 'noForm',
      visible: specificationDisabled,
      formItem: (
        <SpecificationList
          form={form}
          specificationTypeData={specificationTypeData}
          initialValues={initialValues}
          sellType={sellType}
          priceType={priceType}
          editDisabled={editDisabled}
        ></SpecificationList>
      ),
    },
    {
      label: '零售价',
      name: 'sellPrice',
      type: 'number',
      addonBefore: '￥',
      min: 0,
      precision: 2,
      visible: !specificationDisabled && sellType != 'batch' && priceType != 'free',
      extra: '指用户购买的价格',
      disabled: editDisabled,
    },
    {
      label: '卡豆',
      name: 'sellBean',
      type: 'number',
      addonAfter: '卡豆',
      min: 0,
      precision: 0,
      visible: !specificationDisabled && priceType == 'self' && sellType != 'batch',
      extra: '指用户购买的价格',
      disabled: editDisabled,
    },
    {
      label: '商品库存',
      name: 'initStock',
      type: 'number',
      precision: 0,
      min: 0,
      max: 100000000,
      visible: !specificationDisabled,
      disabled: editDisabled,
      // rules: [{ required: true, message: '请输入不小于0, 不大于100000000的数值' }],
    },
    {
      title: '销售规则',
      label: '限购类型',
      name: ['buyLimitRuleObject', 'type'],
      type: 'radio',
      select: ASTRICT_BUY,
      onChange: (e) => {
        setAstrictType(e.target.value);
      },
    },
    {
      label: '单人最高限制份数',
      name: ['buyLimitRuleObject', 'limitNum'],
      visible: AstrictType !== 'unlimited',
    },
    ...manualList.map((i, index) => ({
      title: index == 0 ? '分佣设置' : null,
      // divisionParticipantType
      label: `${ELECTRIC_GOODS_COMMISSION[i.divisionParticipantType]}`,
      name: ['divisionParamInfoReq', `${i.divisionParticipantType}Bean`],
      type: 'number',
      precision: 0,
      min: 0,
      max: 999999,
      disabled: editDisabled,
      visible: commissionShow === '1',
      suffix: '卡豆',
      onChange: () => {
        const keyArr = manualList.map((i) => [
          'serviceDivisionDTO',
          `${i.divisionParticipantType}Bean`,
        ]);
        const valObj = form.getFieldsValue(keyArr);
        const { serviceDivisionDTO = {} } = valObj;
        form.setFieldsValue({
          commission:
            Object.values(serviceDivisionDTO).reduce((pre, cur) => pre + Number(cur || 0), 0) / 100,
        });
      },
    })),
    {
      title: '展示规则',
      label: '前端展示类型',
      name: 'displayType',
      type: 'radio',
      select: priceType == 'free' ? FRONT_SHOW_TYPE_FREE : FRONT_SHOW_TYPE,
    },
    {
      label: '平台商品标签',
      name: 'platformTagIds',
      type: 'select',
      mode: 'multiple',
      select: tagsPlatform,
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
      rules: [{ required: false }],
      addRules: [
        {
          validator: (rule, value) => {
            if (value?.length > 5) {
              return Promise.reject('最多选择5个标签');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      title: '发货设置',
      label: '发货地',
      name: ['shippingRuleObject', 'shippingAddress'],
      type: 'cascader',
      fieldNames: { value: 'label' },
      select: CITYJSON.map((item) => ({
        ...item,
        children: item.children.map((citem) => ({ ...citem, children: undefined })),
      })),
    },
    {
      label: '发货时效',
      name: ['shippingRuleObject', 'shippingTime'],
      type: 'formItem',
      rules: [{ required: true }],
      formItem: <Shipping />,
    },
    {
      label: '七天无理由退换',
      name: ['returnRuleObject', 'returnFlag'],
      type: 'switch',
    },
    {
      label: '运费',
      name: ['postageRuleObject', 'type'],
      type: 'radio',
      select: FREIGHT_TYPE,
      onChange: (e) => {
        setFreightType(e.target.value);
      },
    },
    {
      label: '全国统一价',
      name: ['postageRuleObject', 'fee'],
      type: 'number',
      addonBefore: '￥',
      min: 0,
      precision: 2,
      visible: freightType == 'manual',
      extra: '运费为全国统一价格，不支持按城市配置，且不可使用卡豆抵扣',
    },
    {
      title: '退款设置',
      label: '退款地址',
      name: 'returnRuleObject',
      type: 'formItem',
      rules: [{ required: false }],
      formItem: (
        <Button
          type="primary"
          ghost
          onClick={() => {
            setVisibleRefund({ show: true, list: refundAllData });
          }}
        >
          选择地址
        </Button>
      ),
    },
    {
      type: 'noForm',
      formItem: (
        <DescriptionsCondition
          labelStyle={{ width: 120 }}
          initialValues={refundList}
          formItems={descriptionsItems}
        />
      ),
    },
    {
      title: '结算设置',
      label: '结算人类型',
      name: ['settleInfoReq', 'settlerType'],
      type: 'radio',
      select: SETTLE_TYPE,
      disabled: againUpDisabled,
      // onChange: (e) => {
      //   setSettleType(e.target.value);
      // },
    },
    {
      label: '供应商',
      name: ['settleInfoReq', 'settlerId'],
      // type: 'select',
      // select: settlerSelect,
      // visible: settleType == 'settle',
      disabled: editDisabled,
      hidden: true,
      // loading: loadings.models.baseData,
      // onSearch: (val) => fetchGetSearchSupplier(val, 'settle'),
      // rules: [{ required: false }],
    },
    {
      title: '商品介绍',
      type: 'noForm',
      formItem: (
        <EditorForm
          content={initialValues.richText}
          editCallback={(val) => setContent(val)}
        ></EditorForm>
      ),
    },
  ];

  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
      {/* 退货地址modal */}
      <RefundLocation
        form={form}
        visible={visibleRefund}
        onClose={() => setVisibleRefund(false)}
        setRefundList={setRefundList}
      ></RefundLocation>
      {/* 批采价 */}
      <TieredPricing
        form={form}
        visible={tieredModal}
        onClose={() => setTieredModal(false)}
        specificationDisabled={specificationDisabled}
      ></TieredPricing>
    </>
  );
};

export default connect(({ baseData, loading, specialGoods }) => ({
  classifyParentList: baseData.classifyParentList,
  brandList: baseData.brandList,
  tagsPlatform: baseData.tagsPlatform,
  specialGoods,
  skuMerchantList: baseData.skuMerchantList,
  selectList: baseData.groupMreList,
  loadings: loading,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(PreferentialSet);
