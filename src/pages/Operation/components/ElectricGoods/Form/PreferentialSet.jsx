import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { Button } from 'antd';
import CITYJSON from '@/common/city';
import {
  GOODS_CLASS_TYPE,
  SPECIAL_DESC_TYPE,
  BUSINESS_TYPE,
  COMMISSION_TYPE,
  ELECTRICGOODS_SELL_STATUS,
  ELECTRICGOODS_SKU,
  ELECTRICGOODS_SELL_PRICE_TYPE,
  FRONT_SHOW_TYPE,
  FRONT_SHOW_TYPE_FREE,
  FREIGHT_TYPE,
  SETTLE_TYPE,
} from '@/common/constant';
import { MreSelect, MreSelectShow } from '@/components/MerUserSelectTable';
import EditorForm from '@/components/EditorForm';
import FormCondition from '@/components/FormCondition';
import Shipping from './Shipping';
import RefundLocation from './RefundLocation';
import AddSpecification from './AddSpecification';
import styles from './style.less';

const PreferentialSet = ({
  form,
  editActive,
  loading,
  selectList,
  dispatch,
  commissionShow,
  setCommissionShow,
  initialValues = {},
  skuMerchantList,
  setContent,
}) => {
  // 是否 editActive = 'againUp' || 'again' || 'edit'三种都隐藏的数据
  const commonDisabled = ['againUp', 'again', 'edit'].includes(editActive);
  //活动中隐藏的编辑项//edit 独有不展示
  const editDisabled = ['edit'].includes(editActive);

  const [manualList, setManualList] = useState([]); // 分佣模版字段
  const [supplierSelect, setSupplierSelect] = useState([]);
  const [priceType, setPriceType] = useState('defaultMode'); // 售卖价格类型
  const [freightType, setFreightType] = useState('free'); // 运费类型
  const [settleType, setSettleType] = useState('settle'); // 结算人类型
  const [visibleRefund, setVisibleRefund] = useState(false); // 退货地址modal
  const [refundList, setRefundList] = useState([]); // 退货地址数据暂存
  const [specificationTypeData, setSpecificationTypeData] = useState([]); // 规格类型数据暂存

  //sku通用-是否需要设置佣金
  const getCommissionFlag = (categoryId) => {
    dispatch({
      type: 'baseData/fetchGoodsIsCommission',
      payload: {
        serviceType: 'specialGoods',
        categoryId: categoryId,
      },
      callback: ({ manuallyFlag, manualDivisions }) => {
        setCommissionShow(manuallyFlag);
        setManualList(manualDivisions);
      },
    });
  };

  // 搜索供应商
  const fetchGetSearchSupplier = debounce((content) => {
    if (!content.replace(/'/g, '')) return;
    // dispatch({
    //   type: 'expertUserList/fetchGetBDList',
    //   payload: {
    //     sellName: content.replace(/'/g, ''),
    //   },
    //   callback: setSupplierSelect,
    // });
  }, 500);

  // 信息
  const formItems = [
    {
      title: '选择供应商',
      label: '供应商',
      name: 'brandId',
      type: 'select',
      select: supplierSelect,
      // loading: loading.models.baseData,
      onSearch: (val) => fetchGetSearchSupplier(val),
      // fieldNames: { label: 'categoryName', value: 'categoryIdString' },
    },
    {
      title: '商品信息',
      label: '商品类目',
      name: 'a2',
      type: 'cascader',
      select: [],
    },
    {
      label: '商品编码',
      name: 'a3',
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
      select: ['0', '1'],
      rules: [{ required: false }],
    },
    {
      label: '商品轮播图',
      name: 'goodsDescImg',
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
    },
    {
      label: '库存单位',
      name: 'a8',
      type: 'select',
      select: ELECTRICGOODS_SKU,
    },
    {
      label: '规格设置',
      name: 'a9',
      type: 'formItem',
      formItem: (
        <AddSpecification
          form={form}
          specificationTypeData={specificationTypeData}
          setSpecificationTypeData={setSpecificationTypeData}
        ></AddSpecification>
      ),
      extra: '如有颜色、尺码等多种规格，请添加商品规格。',
    },
    {
      label: '原价',
      name: 'a10',
      type: 'number',
      addonBefore: '￥',
      min: 0,
      precision: 2,
      extra: '用于指导售价调整和为消费者提供的一个参考价，如服装的吊牌价',
    },
    {
      label: '成本价',
      name: 'a11',
      type: 'number',
      addonBefore: '￥',
      min: 0,
      precision: 2,
      extra: '用于平台采买商品时记录成本',
    },
    {
      label: '结算价',
      name: 'a12',
      type: 'number',
      addonBefore: '￥',
      min: 0,
      precision: 2,
      extra: '指供应商/店铺和哒卡乐平台的结算价',
    },
    {
      label: '售卖价格类型',
      name: ['paymentModeObject', 'type'],
      type: 'radio',
      select: ELECTRICGOODS_SELL_PRICE_TYPE,
      onChange: (e) => {
        setPriceType(e.target.value);
        form.setFieldsValue({ displayType: undefined });
      },
    },
    {
      label: '零售价',
      name: ['paymentModeObject', 'cash'],
      type: 'number',
      addonBefore: '￥',
      min: 0,
      precision: 2,
      disabled: priceType == 'free',
      extra: '指用户购买的价格',
    },
    {
      label: '卡豆',
      name: ['paymentModeObject', 'bean'],
      type: 'number',
      addonAfter: '卡豆',
      min: 0,
      precision: 0,
      visible: priceType == 'self',
      extra: '指用户购买的价格',
    },
    {
      label: '商品库存',
      name: 'a15',
      type: 'number',
      precision: 0,
      min: 0,
      max: 100000000,
      // rules: [{ required: true, message: '请输入不小于0, 不大于100000000的数值' }],
    },
    {
      title: '分佣设置',
      // label: '佣金总额', // 手动分佣需要展示
      // name: 'commission',
      // type: 'number',
      // precision: 2,
      // min: 0,
      // max: 999999.99,
      // disabled: commonDisabled,
      // visible: commissionShow == '1',
      // formatter: (value) => `￥ ${value}`,
    },
    ...manualList.map((i) => ({
      label: `${COMMISSION_TYPE[i.divisionParticipantType]}`,
      name: ['serviceDivisionDTO', `${i.divisionParticipantType}Bean`],
      type: 'number',
      precision: 0,
      min: 0,
      max: 999999,
      visible: commissionShow === '1',
      disabled: commonDisabled,
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
      name: 'a17',
      type: 'select',
      mode: 'multiple',
      select: [],
      rules: [{ required: false }],
    },
    {
      label: '展示标签',
      name: 'a18',
      type: 'select',
      mode: 'multiple',
      select: [],
      rules: [{ required: false }],
    },
    {
      title: '发货设置',
      label: '发货地',
      name: ['shippingRuleObject', 'shippingAddress'],
      type: 'cascader',
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
    // {
    //   title: '退款设置',
    //   label: '退款地址',
    //   name: 'a22',
    //   type: 'formItem',
    //   formItem: (
    //     <Button
    //       type="primary"
    //       ghost
    //       onClick={() => {
    //         setVisibleRefund({ show: true });
    //       }}
    //     >
    //       选择地址
    //     </Button>
    //   ),
    // },
    // {
    //   type: 'noForm',
    //   formItem: (
    //     <>
    //       <div className={styles.refund_box}>
    //         <div className={styles.refund_box_1}>收货人</div>
    //         <div style={{ flex: '1' }}>小圆脸</div>
    //       </div>
    //       <div className={styles.refund_box}>
    //         <div className={styles.refund_box_1}>手机号码</div>
    //         <div style={{ flex: '1' }}>18300938232</div>
    //       </div>
    //       <div className={styles.refund_box}>
    //         <div className={styles.refund_box_1}>所在地区</div>
    //         <div style={{ flex: '1' }}>浙江省/杭州市/萧山区</div>
    //       </div>
    //       <div className={styles.refund_box}>
    //         <div className={styles.refund_box_1}>详细地址</div>
    //         <div style={{ flex: '1' }}>国泰科技大厦999</div>
    //       </div>
    //     </>
    //   ),
    // },
    {
      title: '结算设置',
      label: '结算人类型',
      name: ['settleObject', 'settlerType'],
      type: 'radio',
      select: SETTLE_TYPE,
      onChange: (e) => {
        setSettleType(e.target.value);
      },
    },
    {
      label: '供应商',
      name: ['settleObject', 'settlerId'],
      type: 'select',
      select: supplierSelect,
      visible: settleType == 'settle',
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
      <RefundLocation
        form={form}
        visible={visibleRefund}
        onClose={() => setVisibleRefund(false)}
        refundList={refundList}
        setRefundList={setRefundList}
      ></RefundLocation>
      {/* SkuConfigModule */}
    </>
  );
};

export default connect(({ baseData, loading, specialGoods }) => ({
  specialGoods,
  skuMerchantList: baseData.skuMerchantList,
  selectList: baseData.groupMreList,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(PreferentialSet);
