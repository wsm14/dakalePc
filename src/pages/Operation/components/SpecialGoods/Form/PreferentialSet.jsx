import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import moment from 'moment';
import { Button } from 'antd';
import {
  GOODS_CLASS_TYPE,
  SPECIAL_DESC_TYPE,
  BUSINESS_TYPE,
  BUSINESS_SALE_TYPE,
  SPECIAL_SHOW_TYPE,
  SPECIAL_AREA_TYPE,
  COUPON_BUY_RULE,
  COUPON_USER_TIME,
  COUPON_TIME_TYPE,
  COUPON_WEEK_TIME,
  COUPON_ACTIVE_TYPE,
  SPECIAL_USERTIME_TYPE,
  SPECIAL_BALANCE_TYPE,
  SPECIAL_GOODS_TYPE,
} from '@/common/constant';
import { NUM_ALL } from '@/common/regExp';
import { MreSelect, MreSelectShow } from '@/components/MerUserSelectTable';
import { NUM_INT_MAXEIGHT } from '@/common/regExp';
import { DescSet } from '@/components/FormListCondition';
import EditorForm from '@/components/EditorForm';
import FormCondition from '@/components/FormCondition';
import GoodsGroupSet from './GoodsGroupSet';
import { CitySet } from '@/components/FormListCondition';

const PreferentialSet = ({
  form,
  editActive,
  loading,
  selectList,
  slectCopyList,
  dispatch,
  commissionShow,
  setCommissionShow,
  initialValues = {},
  onValuesChange,
  skuMerchantList,
  setContent,
  startDisabled, //是否即将开始   true--是    false --没有
  infoStatus = false,
}) => {
  //编辑的时候数据回显的标签
  // const { goodsTagList = [] } = initialValues;

  // 是否 editActive = 'againUp' || 'again' || 'edit'三种都隐藏的数据
  const commonDisabled = ['againUp', 'again', 'edit'].includes(editActive);
  //活动中隐藏的编辑项//edit 独有不展示
  const editDisabled = ['edit'].includes(editActive) && !startDisabled;
  // console.log(editDisabled, infoStatus, editDisabled && infoStatus, 'infoStatus');

  const [goodsType, setGoodsType] = useState('1'); // 商品类型： 特惠 自我游
  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [goodsDescType, setGoodsDescType] = useState('imgText'); // 商品介绍类型
  const [goodsTaglist, setGoodsTaglist] = useState([]); // 商家商品标签
  const [showTags, setShowTags] = useState([]);
  const [areaType, setAreaType] = useState('all'); // 地域选择
  const [mreList, setMreList] = useState({
    groupId: null,
    type: 'merchant',
    settlerType: 'merchant',
    keys: [],
    list: [],
    paymentModeType: 'defaultMode',
    storeStatus: 'top', //是哪个店铺
    productType: 'single',
    activeTime: '', // 活动时间
    userTime: '', // 使用有效期
    timeSplit: '1,2,3,4,5,6,7', // 适用时段
    timeType: 'all', // 时段内时间选择
    buyRule: 'all', // 购买规则
    disabledDate: [], // 限制时间
    manualDivisionsList: [], //分佣列表
  }); // 店铺备选参数，选择店铺后回显的数据

  // const goodsTags = goodsTagList
  //   .filter((item) => item.tagType === 'merchant')
  //   .map((key) => key.configGoodsTagId);
  // initialValues.goodsTags = goodsTags;

  const goodsTypeName = GOODS_CLASS_TYPE[mreList.productType];
  useEffect(() => {
    if (initialValues.relateName) {
      const {
        buyLimitRuleObject = {}, //购买上线
        timeType,
        timeSplit,
        activityTimeRule: activeTime, //活动时间
        relationOwnerInfoResps = [], //关联集团子门店
        settleInfoResp = {}, //结算人对象
      } = initialValues;
      const { type } = buyLimitRuleObject; //购买上限
      // 商品类型： 特惠 自我游
      setGoodsType(initialValues.thirdInfoReq?.thirdType || '1');
      // form.setFieldsValue({
      //   thirdType: initialValues.thirdType || '1',
      // });
      if (relationOwnerInfoResps.length) {
        const keys = relationOwnerInfoResps.map((item) => item.merchantId);
        saveMreData({ keys: keys, list: relationOwnerInfoResps });
        form.setFieldsValue({ relationOwnerIds: keys });
      }
      //发布城市
      setAreaType(initialValues.availableAreas);

      saveMreData({
        type: initialValues.relateType,
        settlerType: initialValues.settlerType,
        groupId: initialValues.relateId,
        productType: initialValues.productType,
        displayType: initialValues.displayType || 'manualOrList',
        buyRule: type,
        timeType,
        timeSplit,
        activeTime,
        userTime: initialValues?.useTimeRuleObject?.type,
        paymentModeType: initialValues.paymentModeType,
      });

      // 重新发布回显 所选集团/店铺数据 回调获取 是否分佣/商家商品标签
      fetchGetMre(
        ['merchant'].includes(initialValues.relateType) ? initialValues.relateName : undefined,
        initialValues.relateType,
        ['merchant'].includes(initialValues.relateType) ? undefined : initialValues.relateId,
        (list = []) => {
          const mreFindIndex = list.findIndex((item) => item.value === initialValues.relateId);
          const topCategoryId = list[mreFindIndex].topCategoryId[0];
          const { businessStatus, status } = list[mreFindIndex];
          // 是否分佣
          getCommissionFlag(topCategoryId);
          // 商品标签
          // getTagsPlat(topCategoryId);
          // 商家状态
          form.setFieldsValue({ businessStatus, status });
        },
      );
      const { settlerType, settlerId, settlerName } = settleInfoResp;
      if (settlerType !== 'admin') {
        fetchCopyGetMre(
          ['merchant'].includes(settlerType) ? settlerName : undefined,
          settlerType,
          ['merchant'].includes(settlerType) ? undefined : settlerId,
        );
      }
    }
  }, [initialValues.relateName]);
  useEffect(() => {
    //展示标签
    // getShowTags();
    getTagsPlat();
  }, []);

  // 搜索店铺
  const fetchGetMre = debounce((name, type, id, callback) => {
    if (!name && !id) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: {
        name,
        type: type || mreList.type,
        groupFlag: 0, // 不允许选择子门店
        groupId: id,
      },
      callback,
    });
  }, 100);

  // 结算人搜索店铺
  const fetchCopyGetMre = debounce((name, type, id, callback) => {
    if (!name && !id) return;
    dispatch({
      type: 'baseData/fetchGetGroupCopyMreList',
      payload: {
        name,
        type: type || mreList.settlerType,
        groupFlag: 0, // 不允许选择子门店
        groupId: id,
      },
      callback,
    });
  }, 100);

  const saveMreData = (data) => setMreList((old) => ({ ...old, ...data }));

  //获取商家商品标签
  // const getTagsPlat = (categoryId) => {
  //   dispatch({
  //     type: 'baseData/fetchGoodsTagListByCategoryId',
  //     payload: {
  //       categoryId: categoryId,
  //       tagType: 'merchant',
  //     },
  //     callback: (list) => setGoodsTaglist(list),
  //   });
  // };

  //获取商家商品标签
  const getTagsPlat = () => {
    dispatch({
      type: 'goodsTag/fetchGoodsTagList',
      payload: {
        tagType: 'platform',
      },
      callback: (list) => {
        const tagList = list.filter((item) => item.status === '1');
        setGoodsTaglist([...tagList]);
      },
    });
  };

  //获取商家展示标签
  const getShowTags = () => {
    dispatch({
      type: 'goodsTag/fetchGoodsTagList',
      payload: {
        tagType: 'show',
      },
      callback: (list) => {
        const showList = list.map((item) => {
          if (item.status === '1') {
            return item;
          }
        });
        setShowTags([...showList]);
      },
    });
  };

  // 查询店铺主体的费率
  const fetchCheckMreRate = (ownerId, type) => {
    dispatch({
      type: 'specialGoods/fetchCheckMreRate',
      payload: {
        ownerId,
        ownerType: type || mreList.type,
      },
      callback: ({ commissionRatio = 0 }) =>
        saveMreData({
          groupId: ownerId,
          ratio: commissionRatio,
          keys: [],
          list: [],
        }),
    });
  };

  //sku通用-是否需要设置佣金
  const getCommissionFlag = (categoryId) => {
    dispatch({
      type: 'baseData/fetchGoodsIsCommission',
      payload: {
        serviceType: 'specialGoods',
        categoryId: categoryId,
      },
      callback: ({ manuallyFlag, manualDivisions = [] }) => {
        const fieldList = manualDivisions.map((item) => item.divisionParticipantType);
        saveMreData({ manualDivisionsList: [...fieldList] });
        setCommissionShow(manuallyFlag);
      },
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
      ellipsis: true,
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      ellipsis: true,
    },
  ];

  // 信息
  const formItems = [
    {
      title: '设置参与活动的店铺',
      label: '选择店铺类型',
      type: 'radio',
      disabled: editDisabled,
      name: 'relateType',
      select: BUSINESS_TYPE,
      onChange: (e) => {
        setCommissionShow(false);
        saveMreData({
          type: e.target.value,
          settlerType: e.target.value,
          groupId: null,
          ratio: 0,
          keys: [],
          list: [],
          storeStatus: 'top',
          shopType: '0',
        }); // 重置已选店铺数据
        form.setFieldsValue({ relateId: undefined, settlerType: e.target.value, cityList: [[]] }); // 重置数据
        dispatch({ type: 'baseData/clearGroupMre' }); // 清空选择数据
      },
    },
    {
      label: `选择${BUSINESS_TYPE[mreList.type]}`,
      type: 'select',
      name: 'relateId',
      placeholder: '请输入搜索',
      loading,
      select: selectList,
      disabled: editDisabled,
      onSearch: (val) => {
        fetchGetMre(val);
        fetchCopyGetMre(val);
      },
      onChange: (val, data) => {
        const { option } = data;
        const { businessStatus, status, districtCode } = option;
        form.setFieldsValue({
          relationOwnerIds: undefined,
          businessStatus,
          status,
          settlerId: val,
          availableAreas: 'city',
          cityList: [{ city: [districtCode.slice(0, 2), districtCode.slice(0, 4)] }],
        });

        setAreaType('city');
        setCommissionShow(false);
        getCommissionFlag(option.topCategoryId[0]);
        getTagsPlat(option.topCategoryId[0]);
        fetchCheckMreRate(val);
      },
      addRules: [
        {
          validator: () => {
            const statusVal = form.getFieldsValue(['businessStatus', 'status']);
            const { businessStatus, status } = statusVal;
            if (businessStatus === '0' || status === '0') {
              return Promise.reject(
                '该店铺已禁用/已暂停营业，请先将店铺状态改成正常营业再进行发布。',
              );
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: `商家状态`,
      name: 'status',
      hidden: true,
    },
    {
      label: `商家营业状态`,
      name: 'businessStatus',
      hidden: true,
    },
    // {
    //   label: '店铺范围',
    //   type: 'radio',
    //   name: 'shopType',
    //   disabled: editActive,
    //   visible: mreList.name && mreList.type === 'group',
    //   select: ['全部', '部分'],
    //   onChange: (e) => saveSelectData({ shopType: e.target.value }),
    // },
    {
      label: '适用店铺',
      name: 'relationOwnerIds',
      type: 'formItem',
      visible: mreList.type == 'group',
      rules: [{ required: true, message: '请选择店铺' }],
      formItem: (
        <Button
          type="primary"
          ghost
          onClick={() => {
            setVisible(true);
          }}
          // disabled={commonDisabled}
        >
          选择店铺
        </Button>
      ),
    },
    {
      type: 'noForm',
      visible: mreList.type === 'group',
      formItem: (
        <MreSelectShow
          key="MreTable"
          form={form}
          // disabled={commonDisabled}
          rowKey="merchantId"
          columns={getColumns}
          {...mreList}
          setMreList={(val) => {
            saveMreData({ ...val });
            form.setFieldsValue({ relationOwnerIds: val.keys });
          }}
        ></MreSelectShow>
      ),
    },
    {
      title: '设置商品信息',
      label: '商品类别',
      name: ['thirdInfoReq', 'thirdType'],
      type: 'radio',
      disabled: editDisabled,
      select: SPECIAL_GOODS_TYPE,
      onChange: (e) => {
        setGoodsType(e.target.value);
      },
    },
    {
      label: '自我游编码',
      name: ['thirdInfoReq', 'thirdId'],
      visible: goodsType === '2',
      onChange: (e) => {
        form.setFieldsValue({
          thirdId: e.target.value.replace(/ /g, ''),
        });
      },
    },
    {
      label: '商品类型',
      name: 'productType',
      disabled: editDisabled,
      type: 'radio',
      select: GOODS_CLASS_TYPE,
      onChange: (e) => saveMreData({ productType: e.target.value }),
    },
    {
      label: `${goodsTypeName}轮播图`,
      name: 'goodsBriefImg',
      type: 'upload',
      maxFile: 5,
      maxSize: 500,
    },
    {
      label: `${goodsTypeName}名称`,
      name: 'goodsName',
      maxLength: 30,
    },
    {
      type: 'noForm',
      visible: mreList.productType == 'package',
      formItem: <GoodsGroupSet key="packageGroupObjects" form={form}></GoodsGroupSet>,
    },
    {
      title: '销售信息',
      // label: `${goodsTypeName}原价`,
      label: '原价',
      name: ['skuInfoReq', 'oriPrice'],
      type: 'number',
      precision: 2,
      disabled: editDisabled && infoStatus,
      min: 0,
      max: 999999.99,
      step: '0.01',
      addonBefore: '￥',
      onChange: (e) => saveMreData({ oriPrice: e }),
    },
    {
      label: '成本价',
      name: ['skuInfoReq', 'costPrice'],
      type: 'number',
      precision: 2,
      // disabled: editDisabled,
      min: 0,
      max: 999999.99,
      step: '0.01',
      addonBefore: '￥',
      required: false,
      rules: [{ required: false }],
    },
    {
      label: '结算价',
      name: ['skuInfoReq', 'settlePrice'],
      type: 'number',
      precision: 2,
      disabled: editDisabled && infoStatus,
      min: 0,
      max: 999999.99,
      step: '0.01',
      addonBefore: '￥',
      addRules: [
        {
          validator: (rule, value) => {
            const merchantPrice = Number(value);
            const buyPrice = Number(form.getFieldValue(['skuInfoReq', 'sellPrice']));
            const sellBean = Number(form.getFieldValue(['skuInfoReq', 'sellBean'])) / 100 || 0;
            if (merchantPrice > buyPrice + sellBean && mreList.paymentModeType !== 'free') {
              return Promise.reject('商家结算价不可超过零售价格');
            }
            // “商家结算价不可超过N（结算价≤特惠价格*（1-费率））”
            const getPrice = (buyPrice + sellBean) * (1 - mreList.ratio / 100);
            if (merchantPrice > getPrice && mreList.paymentModeType !== 'free') {
              return Promise.reject(`商家结算价不可超过${getPrice.toFixed(2)}`);
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '售卖价格类型',
      type: 'radio',
      name: 'paymentModeType',
      select: BUSINESS_SALE_TYPE,
      disabled: editDisabled && infoStatus,
      onChange: (e) => {
        saveMreData({ paymentModeType: e.target.value });
        form.setFieldsValue({
          skuInfoReq: { sellBean: undefined },
        });
      },
    },
    {
      // label: '特惠价格',
      label: '零售价',
      name: ['skuInfoReq', 'sellPrice'],
      type: 'number',
      precision: 2,
      disabled: editDisabled && infoStatus,
      visible: !['free'].includes(mreList.paymentModeType),
      min: 0,
      max: 999999.99,
      step: '0.01',
      addonBefore: '￥',
      onChange: (e) => {
        saveMreData({ sellPrice: e });
      },
      addonAfter: `${
        mreList.oriPrice && mreList.sellPrice
          ? ((Number(mreList.sellPrice) / Number(mreList.oriPrice)) * 10).toString().substring(0, 4)
          : 0
      }折`,
      addRules: [
        {
          validator: (rule, value) => {
            const realPrice = Number(value);
            const buyPrice = Number(form.getFieldValue(['skuInfoReq', 'oriPrice']));
            if (realPrice >= buyPrice) {
              return Promise.reject('零售价格需小于原价');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '卡豆',
      name: ['skuInfoReq', 'sellBean'],
      type: 'number',
      precision: 0,
      disabled: editDisabled && infoStatus,
      min: 1,
      visible: mreList.paymentModeType == 'self',
      // rules: [{ required: false }],
    },
    {
      label: '其他平台价格',
      name: 'otherPlatformPrice',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      step: '0.01',
      addonBefore: '￥',
      required: false,
      // disabled: editDisabled,
      rules: [{ required: false }],
    },
    {
      label: '商品库存',
      name: ['skuInfoReq', 'initStock'],
      type: 'number',
      precision: 0,
      disabled: ['edit'].includes(editActive),
      min: 1,
      max: 100000000,
    },
    // {
    //   label: '佣金总额', // 手动分佣需要展示
    //   name: 'commission',
    //   type: 'number',
    //   precision: 2,
    //   min: 0,
    //   max: 999999.99,
    //   // disabled: commonDisabled,
    //   visible: commissionShow == '1',
    //   formatter: (value) => `￥ ${value}`,
    //   // rules: [{ required: false }],
    // },
    {
      title: '销售规则',
      label: '活动时间',
      type: 'radio',
      select: COUPON_ACTIVE_TYPE,
      disabled: editDisabled && infoStatus,
      name: 'activityTimeRule',
      onChange: (e) => saveMreData({ activeTime: e.target.value }),
    },
    {
      label: '设置时间',
      // name: 'activityStartTime',
      name: 'activityStartDate',
      type: 'rangePicker',
      disabled: editDisabled && infoStatus,
      visible: mreList.activeTime === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
      onChange: (val) => form.setFieldsValue({ activeDate: undefined }),
    },
    {
      label: '使用有效期',
      type: 'radio',
      select: SPECIAL_USERTIME_TYPE,
      name: ['useTimeRuleObject', 'type'],
      disabled: editDisabled && infoStatus,
      onChange: (e) => saveMreData({ userTime: e.target.value }),
    },
    {
      label: '固定时间',
      name: 'startDate',
      type: 'rangePicker',
      disabled: editDisabled && infoStatus,
      visible: mreList.userTime === 'fixed',
      disabledDate: (time) => {
        const dates = form.getFieldValue('activityStartDate');
        const noewdate = moment().endOf('day').subtract(1, 'day');
        if (!dates || dates.length === 0) return time < noewdate;
        const tooLate = dates[0] && time < dates[0];
        return tooLate;
      },
      onCalendarChange: (val) => saveMreData({ disabledDate: val }),
      addRules: [
        {
          validator: (rule, time) => {
            const dates = form.getFieldValue('activityStartDate');
            if (dates && time && time[1] < dates[1]) {
              return Promise.reject('有效期结束时间必须大于活动时间');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '领取后生效天数',
      name: ['useTimeRuleObject', 'delayDays'],
      type: 'number',
      max: 999,
      min: 0,
      precision: 0,
      disabled: editDisabled && infoStatus,
      visible: mreList.userTime === 'gain',
    },
    {
      label: '有效期天数',
      name: ['useTimeRuleObject', 'activeDays'],
      type: 'number',
      disabled: editDisabled && infoStatus,
      max: 999,
      min: 0,
      precision: 0,
      visible: mreList.userTime === 'gain',
    },
    {
      label: '适用时段',
      type: 'radio',
      select: COUPON_USER_TIME,
      disabled: editDisabled && infoStatus,
      name: 'timeSplit',
      onChange: (e) => saveMreData({ timeSplit: e.target.value }),
    },
    {
      label: '每周',
      type: 'checkbox',
      select: COUPON_WEEK_TIME,
      disabled: editDisabled && infoStatus,
      name: 'useWeek',
      visible: mreList.timeSplit === 'part',
    },
    {
      label: '时间选择',
      type: 'radio',
      select: COUPON_TIME_TYPE,
      disabled: editDisabled && infoStatus,
      name: 'timeType',
      visible: mreList.timeSplit !== '',
      onChange: (e) => saveMreData({ timeType: e.target.value }),
    },
    {
      label: '设置时间段',
      name: 'useDay',
      type: 'timePicker',
      disabled: editDisabled && infoStatus,
      order: false,
      visible: mreList.timeType === 'part',
    },
    {
      title: '设置购买规则',
      label: '购买上限',
      type: 'radio',
      name: ['buyLimitRuleObject', 'type'],
      select: COUPON_BUY_RULE,
      onChange: (e) => saveMreData({ buyRule: e.target.value }),
    },
    {
      label: `单人${{ personLimit: '每人', dayLimit: '每天' }[mreList.buyRule]}购买份数`,
      name: ['buyLimitRuleObject', 'limitNum'],
      suffix: '份',
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '份数必须为整数，且不可为0' }],
      visible: ['personLimit', 'dayLimit'].includes(mreList.buyRule),
    },
    {
      label: '是否需要预约购买',
      type: 'switch',
      name: 'needOrder',
    },
    {
      label: '随时退',
      type: 'switch',
      name: 'allowRefund',
    },
    {
      label: '过期退',
      type: 'switch',
      name: 'expireRefund',
    },
    {
      label: '购买须知',
      name: 'buyDesc',
      type: 'formItem',
      formItem: <DescSet name={'buyDesc'}></DescSet>,
    },
    {
      title: '分佣设置',
      type: 'noForm',
      visible: commissionShow == '1' && mreList.manualDivisionsList.length,
    },
    {
      label: '省代分佣',
      name: ['divisionParamInfoReq', 'provinceBean'],
      visible: commissionShow == '1' && mreList.manualDivisionsList.includes('province'),
      addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
      addonAfter: '卡豆',
    },
    {
      label: '市级分佣',
      name: ['divisionParamInfoReq', 'cityBean'],
      visible: commissionShow == '1' && mreList.manualDivisionsList.includes('city'),
      addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
      addonAfter: '卡豆',
    },
    {
      label: '区县分佣',
      name: ['divisionParamInfoReq', 'districtBean'],
      visible: commissionShow == '1' && mreList.manualDivisionsList.includes('district'),
      addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
      addonAfter: '卡豆',
    },
    {
      label: '用户家主分佣',
      name: ['divisionParamInfoReq', 'userParentBean'],
      visible: commissionShow == '1' && mreList.manualDivisionsList.includes('userParent'),
      addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
      addonAfter: '卡豆',
    },
    {
      label: '哒人分佣',
      name: ['divisionParamInfoReq', 'darenBean'],
      visible: commissionShow == '1' && mreList.manualDivisionsList.includes('daren'),
      addRules: [{ pattern: NUM_ALL, message: '输入格式不正确' }],
      addonAfter: '卡豆',
    },
    {
      title: `展示信息`,
      label: '前端展示类型',
      type: 'radio',
      name: 'displayType',
      select: SPECIAL_SHOW_TYPE[mreList.paymentModeType],
      onChange: (e) => saveMreData({ displayType: e.target.value }),
    },
    {
      label: '展示范围',
      name: 'availableAreas',
      type: 'radio',
      select: SPECIAL_AREA_TYPE,
      onChange: (e) => {
        form.setFieldsValue({ cityList: [[]] });
        setAreaType(e.target.value);
      },
    },
    {
      label: '选择城市',
      type: 'formItem',
      visible: ['city'].includes(areaType),
      formItem: (
        <CitySet
          name="cityList"
          form={form}
          maxLength={50}
          areaType={areaType}
          changeOnSelect={false}
        ></CitySet>
      ),
    },
    {
      label: '平台商品标签',
      name: 'platformTagIds',
      type: 'select',
      mode: 'multiple',
      placeholder: '请选择商家商品标签',
      select: goodsTaglist,
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
      rules: [{ required: false }],
      addRules: [
        {
          validator: (rule, value) => {
            if (value?.length > 3) {
              return Promise.reject('最多选择3个标签');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    // {
    //   label: '展示标签',
    //   name: 'displayFilterTags',
    //   type: 'select',
    //   mode: 'multiple',
    //   placeholder: '请选择展示标签',
    //   select: showTags,
    //   fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
    //   addRules: [
    //     {
    //       validator: (rule, value) => {
    //         if (value.length > 3) {
    //           return Promise.reject('最多选择3个标签');
    //         }
    //         return Promise.resolve();
    //       },
    //     },
    //   ],
    // },
    {
      title: '结算设置',
      label: '结算人类型',
      type: 'radio',
      disabled: editDisabled,
      name: 'settlerType',
      select: SPECIAL_BALANCE_TYPE,
      onChange: (e) => {
        saveMreData({
          settlerType: e.target.value,
        }); // 重置已选店铺数据
        form.setFieldsValue({ settlerId: undefined }); // 重置数据
        dispatch({ type: 'baseData/clearGroupMre' }); // 清空选择数据
      },
    },
    {
      label: `选择${BUSINESS_TYPE[mreList.settlerType]}`,
      type: 'select',
      name: 'settlerId',
      placeholder: '请输入搜索',
      loading,
      select: slectCopyList,
      disabled: editDisabled,
      onSearch: fetchCopyGetMre,
      visible: !['admin'].includes(mreList.settlerType),
      onChange: (val, data) => {
        fetchCheckMreRate(val);
      },
    },

    {
      title: `设置${goodsTypeName}介绍`,
      type: 'noForm',
      formItem: (
        <EditorForm
          content={initialValues.richText}
          editCallback={(val) => setContent(val)}
        ></EditorForm>
      ),
    },
    {
      label: '选择介绍类型',
      type: 'radio',
      name: 'descType',
      select: SPECIAL_DESC_TYPE,
      hidden: true,
    },
    // {
    //   title: `设置${goodsTypeName}介绍`,
    //   label: '选择介绍类型',
    //   type: 'radio',
    //   name: 'descType',
    //   select: SPECIAL_DESC_TYPE,
    //   onChange: (e) => setGoodsDescType(e.target.value),
    // },
    // {
    //   label: `${goodsTypeName}介绍`,
    //   type: 'textArea',
    //   name: 'goodsDesc',
    //   hidden: goodsDescType !== 'imgText',
    //   rules: [{ required: false }],
    //   maxLength: 200,
    // },
    // {
    //   label: `${goodsTypeName}图片`,
    //   name: 'goodsDescImg',
    //   type: 'upload',
    //   maxFile: 20,
    //   hidden: goodsDescType !== 'imgText',
    //   rules: [{ required: false }],
    // },
    {
      type: 'noForm',
      visible: goodsDescType === 'richText',
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
        onValuesChange={(changedValues, allValues) => onValuesChange && onValuesChange(allValues)}
      ></FormCondition>
      <MreSelect
        dispatchType={'baseData/fetchSkuAvailableMerchant'}
        rowKey="merchantId"
        keys={mreList.keys}
        visible={visible}
        mreList={mreList.list}
        pagination={false}
        params={{ groupId: mreList.groupId }}
        onOk={(val) => {
          saveMreData({ ...val });
          form.setFieldsValue({ relationOwnerIds: val.keys });
        }}
        onCancel={() => setVisible(false)}
        columns={getColumns}
        searchShow={false}
        list={skuMerchantList}
      ></MreSelect>
    </>
  );
};
export default connect(({ baseData, loading, specialGoods }) => ({
  specialGoods,
  skuMerchantList: baseData.skuMerchantList,
  selectList: baseData.groupMreList,
  slectCopyList: baseData.groupCopyMreList,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(PreferentialSet);
