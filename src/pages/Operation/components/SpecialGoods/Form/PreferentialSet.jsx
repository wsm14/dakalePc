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
} from '@/common/constant';
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
  dispatch,
  commissionShow,
  setCommissionShow,
  initialValues = {},
  onValuesChange,
  skuMerchantList,
  setContent,
}) => {
  // 是否 editActive = 'againUp' || 'again' || 'edit'三种都隐藏的数据
  const commonDisabled = ['againUp', 'again', 'edit'].includes(editActive);
  //活动中隐藏的编辑项//edit 独有不展示
  const editDisabled = ['edit'].includes(editActive);

  const [goodsType, setGoodsType] = useState('1'); // 商品类型： 特惠 自我游
  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [goodsDescType, setGoodsDescType] = useState('0'); // 商品介绍类型
  const [radioData, setRadioData] = useState({
    goodsType: 'single',
    activeTime: '', // 活动时间
    userTime: '', // 使用有效期
    timeSplit: '', // 适用时段
    timeType: 'all', // 时段内时间选择
    buyRule: 'all', // 购买规则
    disabledDate: [], // 限制时间
  }); // 商品类型 goodsType
  const [goodsTaglist, setGoodsTaglist] = useState([]); // 商家商品标签
  const [areaType, setAreaType] = useState('all'); // 地域选择
  const [mreList, setMreList] = useState({
    groupId: null,
    type: 'merchant',
    keys: [],
    list: [],
  }); // 店铺备选参数，选择店铺后回显的数据

  const [validate, setValidate] = useState({
    groupId: null,
    type: 'merchant',
    keys: [],
    list: [],
  });

  //编辑的时候数据回显的标签
  const { goodsTagList = [] } = initialValues;

  const goodsTags = goodsTagList
    .filter((item) => item.tagType === 'merchant')
    .map((key) => key.configGoodsTagId);
  initialValues.goodsTags = goodsTags;

  const goodsTypeName = GOODS_CLASS_TYPE[radioData.goodsType];
  useEffect(() => {
    if (initialValues.ownerName) {
      const {
        buyRule,
        timeType,
        timeSplit,
        activityTimeRule: activeTime,
        useTimeRule: userTime,
      } = initialValues;
      // 商品类型： 特惠 自我游
      setGoodsType(initialValues.thirdFlag || '1');
      form.setFieldsValue({
        thirdFlag: initialValues.thirdFlag || '1',
      });
      // 图文介绍类型
      setGoodsDescType(initialValues.goodsDescType);
      setMreList({
        type: initialValues.ownerType,
        groupId: initialValues.ownerId,
      });
      setRadioData({
        goodsType: initialValues.goodsType,
        buyRule,
        timeType,
        timeSplit,
        activeTime,
        userTime,
      });
      // 重新发布回显 所选集团/店铺数据 回调获取 是否分佣/商家商品标签
      fetchGetMre(initialValues.ownerName, initialValues.ownerType, (list = []) => {
        const mreFindIndex = list.findIndex((item) => item.value === initialValues.ownerId);
        const topCategoryId = list[mreFindIndex].topCategoryId[0];
        const { businessStatus, status } = list[mreFindIndex];
        // 是否分佣
        getCommissionFlag(topCategoryId);
        // 商品标签
        getTagsPlat(topCategoryId);
        // 商家状态
        form.setFieldsValue({ businessStatus, status });
      });
      if (initialValues.ownerType === 'group') {
        getMerchantList();
      }
    }
  }, [initialValues.ownerName]);
  //sku通用-sku挂靠商家列表
  const getMerchantList = () => {
    dispatch({
      type: 'baseData/fetchSkuDetailMerchantList',
      payload: {
        ownerServiceId: initialValues.specialGoodsId,
        ownerId: initialValues.ownerIdString,
        serviceType: 'specialGoods',
      },
      callback: (list) => {
        const keys = list.map((item) => item.merchantId);
        saveMreData({ keys: keys, list: list });
        form.setFieldsValue({ merchantIds: keys });
      },
    });
  };
  // 搜索店铺
  const fetchGetMre = debounce((name, type, callback) => {
    if (!name) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: {
        name,
        type: type || mreList.type,
        groupFlag: 0, // 不允许选择子门店
      },
      callback,
    });
  }, 100);

  const saveMreData = (data) => setMreList((old) => ({ ...old, ...data }));

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  //获取商家商品标签
  const getTagsPlat = (categoryId) => {
    dispatch({
      type: 'baseData/fetchGoodsTagListByCategoryId',
      payload: {
        categoryId: categoryId,
        tagType: 'merchant',
      },
      callback: (list) => setGoodsTaglist(list),
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
      callback: ({ manuallyFlag, manualDivisions }) => setCommissionShow(manuallyFlag),
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
      disabled: commonDisabled,
      name: 'ownerType',
      select: BUSINESS_TYPE,
      onChange: (e) => {
        setCommissionShow(false);
        saveSelectData({ shopType: '0' });
        saveMreData({
          type: e.target.value,
          groupId: null,
          ratio: 0,
          keys: [],
          list: [],
        }); // 重置已选店铺数据
        form.setFieldsValue({ ownerId: undefined, jiesuanType: e.target.value, cityList: [[]] }); // 重置数据
        dispatch({ type: 'baseData/clearGroupMre' }); // 清空选择数据
      },
    },
    {
      label: `选择${BUSINESS_TYPE[mreList.type]}`,
      type: 'select',
      name: 'ownerId',
      placeholder: '请输入搜索',
      loading,
      select: selectList,
      disabled: commonDisabled,
      onSearch: fetchGetMre,
      onChange: (val, data) => {
        console.log(val, data);
        const { option } = data;
        const { businessStatus, status, districtCode } = option;
        console.log([[districtCode.slice(0, 2), districtCode.slice(0, 4)]], '地区');
        form.setFieldsValue({
          merchantIds: undefined,
          businessStatus,
          status,
          jiesuanId: val,
          areaType: 'city',
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
      name: 'merchantIds',
      type: 'formItem',
      visible: mreList.type == 'group',
      rules: [{ required: true, message: '请选择店铺' }],
      formItem: (
        <Button type="primary" ghost onClick={() => setVisible(true)} disabled={commonDisabled}>
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
          disabled={commonDisabled}
          rowKey="merchantId"
          columns={getColumns}
          {...mreList}
          setMreList={(val) => {
            console.log(val, 'val');
            saveMreData(val);
            form.setFieldsValue({ merchantIds: val.keys });
          }}
        ></MreSelectShow>
      ),
    },
    {
      title: '设置商品信息',
      label: '商品类别',
      name: 'thirdFlag',
      type: 'radio',
      disabled: commonDisabled,
      select: { 1: '特惠商品', 2: '自我游商品' },
      onChange: (e) => {
        setGoodsType(e.target.value);
      },
    },
    {
      label: '自我游编码',
      name: 'thirdCode',
      visible: goodsType === '2',
      onChange: (e) => {
        form.setFieldsValue({
          thirdCode: e.target.value.replace(/ /g, ''),
        });
      },
    },
    {
      label: '商品类型',
      name: 'goodsType',
      disabled: commonDisabled,
      type: 'radio',
      select: GOODS_CLASS_TYPE,
      onChange: (e) => saveSelectData({ goodsType: e.target.value }),
    },
    {
      label: `${goodsTypeName}轮播图`,
      name: 'activityGoodsImg',
      type: 'upload',
      maxFile: 5,
      maxSize: 500,
    },
    {
      label: `${goodsTypeName}名称`,
      name: 'goodsName',
      maxLength: 80,
    },
    {
      type: 'noForm',
      visible: radioData.goodsType == 'package',
      formItem: <GoodsGroupSet key="packageGroupObjects" form={form}></GoodsGroupSet>,
    },
    {
      title: '销售信息',
      // label: `${goodsTypeName}原价`,
      label: '原价',
      name: 'oriPrice',
      type: 'number',
      precision: 2,
      disabled: editDisabled,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: '成本价',
      name: 'chengbenajia',
      type: 'number',
      precision: 2,
      disabled: editDisabled,
      min: 0,
      max: 999999.99,
      required: false,
      rules: [{ required: false }],
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: '结算价',
      name: 'merchantPrice',
      type: 'number',
      precision: 2,
      disabled: editDisabled,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
      addRules: [
        {
          validator: (rule, value) => {
            const merchantPrice = Number(value);
            const buyPrice = Number(form.getFieldValue('realPrice'));
            if (merchantPrice > buyPrice) {
              return Promise.reject('商家结算价不可超过售卖价格');
            }
            // “商家结算价不可超过N（结算价≤特惠价格*（1-费率））”
            const getPrice = buyPrice * (1 - mreList.ratio / 100);
            if (merchantPrice > getPrice) {
              return Promise.reject(`商家结算价不可超过${getPrice}`);
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '售卖价格类型',
      type: 'radio',
      name: 'priceType',
      select: BUSINESS_SALE_TYPE,
      onChange: (e) => {},
    },
    {
      // label: '特惠价格',
      label: '零售价',
      name: 'realPrice',
      type: 'number',
      precision: 2,
      disabled: editDisabled,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
      addRules: [
        {
          validator: (rule, value) => {
            const realPrice = Number(value);
            const buyPrice = Number(form.getFieldValue('oriPrice'));
            if (realPrice > buyPrice) {
              return Promise.reject('特惠价格需小于套餐价格');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '其他平台价格',
      name: 'otherPlatformPrice',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      required: false,
      rules: [{ required: false }],
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: '商品库存',
      name: 'kucun',
      type: 'number',
      precision: 0,
      min: 0,
      max: 100000000,
    },
    {
      label: '佣金总额', // 手动分佣需要展示
      name: 'commission',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      disabled: commonDisabled,
      visible: commissionShow == '1',
      formatter: (value) => `￥ ${value}`,
      // rules: [{ required: false }],
    },

    {
      title: '销售规则',
      label: '活动时间',
      type: 'radio',
      select: COUPON_ACTIVE_TYPE,
      disabled: editDisabled,
      name: 'activityTimeRule',
      onChange: (e) => saveSelectData({ activeTime: e.target.value }),
    },
    {
      label: '设置时间',
      name: 'activityStartTime',
      type: 'rangePicker',
      disabled: editDisabled,
      visible: radioData.activeTime === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
      onChange: (val) => form.setFieldsValue({ activeDate: undefined }),
    },
    {
      label: '使用有效期',
      type: 'radio',
      select: SPECIAL_USERTIME_TYPE,
      name: 'activityTimeRule',
      disabled: editDisabled,
      onChange: (e) => saveSelectData({ userTime: e.target.value }),
    },
    {
      label: '固定时间',
      name: 'useStartTime',
      type: 'rangePicker',
      disabled: editDisabled,
      visible: radioData.userTime === 'fixed',
      disabledDate: (time) => {
        const dates = form.getFieldValue('actsdiveDate');
        const noewdate = moment().endOf('day').subtract(1, 'day');
        if (!dates || dates.length === 0) return time < noewdate;
        const tooLate = dates[0] && time < dates[0];
        return tooLate;
      },
      onCalendarChange: (val) => saveSelectData({ disabledDate: val }),
      addRules: [
        {
          validator: (rule, time) => {
            const dates = form.getFieldValue('actsdiveDate');
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
      name: 'delayDays',
      type: 'number',
      max: 999,
      min: 0,
      precision: 0,
      disabled: editDisabled,
      visible: radioData.userTime === 'gain',
    },
    {
      label: '有效期天数',
      name: 'activeDays',
      type: 'number',
      disabled: editDisabled,
      max: 999,
      min: 0,
      precision: 0,
      visible: radioData.userTime === 'gain',
    },
    {
      label: '适用时段',
      type: 'radio',
      select: COUPON_USER_TIME,
      name: 'timeSplit',
      onChange: (e) => saveSelectData({ timeSplit: e.target.value }),
    },
    {
      label: '每周',
      type: 'checkbox',
      select: COUPON_WEEK_TIME,
      name: 'useWeek',
      visible: radioData.timeSplit === 'part',
    },
    {
      label: '时间选择',
      type: 'radio',
      select: COUPON_TIME_TYPE,
      name: 'timeType',
      visible: radioData.timeSplit !== '',
      onChange: (e) => saveSelectData({ timeType: e.target.value }),
    },
    {
      label: '设置时间段',
      name: 'useTime',
      type: 'timePicker',
      order: false,
      visible: radioData.timeType === 'part',
    },
    {
      label: '投放总量',
      name: 'total',
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '投放总量必须为整数，且不可为0' }],
      disabled: editDisabled,
      suffix: '份',
    },
    {
      title: '设置购买规则',
      label: '购买上限',
      type: 'radio',
      name: 'buyRule',
      select: COUPON_BUY_RULE,
      onChange: (e) => saveSelectData({ buyRule: e.target.value }),
    },
    {
      label: `单人${{ personLimit: '每人', dayLimit: '每天' }[radioData.buyRule]}购买份数`,
      name: { personLimit: 'maxBuyAmount', dayLimit: 'dayMaxBuyAmount' }[radioData.buyRule],
      suffix: '份',
      addRules: [{ pattern: NUM_INT_MAXEIGHT, message: '份数必须为整数，且不可为0' }],
      visible: ['personLimit', 'dayLimit'].includes(radioData.buyRule),
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
      title: '设置退款规则',
      label: '是否允许随时退款',
      type: 'switch',
      hidden: true,
      name: 'allowRefund',
    },
    {
      label: '是否允许过期退款',
      type: 'switch',
      hidden: true,
      name: 'allowExpireRefund',
    },
    {
      title: `展示信息`,
      label: '前端展示类型',
      type: 'radio',
      name: 'displayType',
      select: SPECIAL_SHOW_TYPE,
      onChange: (e) => setGoodsDescType(e.target.value),
    },
    {
      label: '展示范围',
      name: 'areaType',
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
      // label: '商家商品标签',
      label: '平台商品标签',
      name: 'goodsTags',
      type: 'select',
      mode: 'multiple',
      placeholder: '请选择商家商品标签',
      select: goodsTaglist,
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
      addRules: [
        {
          validator: (rule, value) => {
            if (value.length > 3) {
              return Promise.reject('最多选择3个标签');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      title: '结算设置',
      label: '结算人类型',
      type: 'radio',
      disabled: commonDisabled,
      name: ['settleInfoReq', 'settlerType'],
      select: SPECIAL_BALANCE_TYPE,
      onChange: (e) => {
        saveSelectData({ settlerType: e });
      },
    },
    {
      label: '结算店铺类型',
      type: 'radio',
      disabled: commonDisabled,
      name: 'jiesuanType',
      select: BUSINESS_TYPE,
      disabled: true,
      visible: ['merchant'].includes(mreList.settlerType),
      onChange: (e) => {
        saveMreData({
          type: e.target.value,
          groupId: null,
          ratio: 0,
          keys: [],
          list: [],
        }); // 重置已选店铺数据
        form.setFieldsValue({ jiesuanId: undefined }); // 重置数据
        dispatch({ type: 'baseData/clearGroupMre' }); // 清空选择数据
      },
    },
    {
      label: `选择${BUSINESS_TYPE[mreList.type]}`,
      type: 'select',
      name: 'jiesuanId',
      placeholder: '请输入搜索',
      loading,
      select: selectList,
      disabled: commonDisabled,
      onSearch: fetchGetMre,
      disabled: true,
      visible: ['merchant'].includes(mreList.settlerType),
      onChange: (val, data) => {
        const { option } = data;
        const { businessStatus, status } = option;
        fetchCheckMreRate(val);
      },
    },
    {
      label: '适用店铺',
      name: 'jiesuanIds',
      type: 'formItem',
      visible: ['merchant'].includes(mreList.settlerType),
      rules: [{ required: true, message: '请选择店铺' }],
      formItem: (
        <Button type="primary" ghost onClick={() => setVisible(true)} disabled={true}>
          选择店铺
        </Button>
      ),
    },
    {
      type: 'noForm',
      visible: ['merchant'].includes(mreList.settlerType),
      formItem: (
        <MreSelectShow
          key="MreTable"
          form={form}
          disabled={true}
          rowKey="merchantId"
          columns={getColumns}
          {...mreList}
          setMreList={(val) => {
            saveMreData(val);
            form.setFieldsValue({ jiesuanIds: val.keys });
          }}
        ></MreSelectShow>
      ),
    },
    {
      title: `设置${goodsTypeName}介绍`,
      label: '选择介绍类型',
      type: 'radio',
      name: 'goodsDescType',
      select: SPECIAL_DESC_TYPE,
      onChange: (e) => setGoodsDescType(e.target.value),
    },
    {
      label: `${goodsTypeName}介绍`,
      type: 'textArea',
      name: 'goodsDesc',
      hidden: goodsDescType !== '0',
      rules: [{ required: false }],
      maxLength: 200,
    },
    {
      label: `${goodsTypeName}图片`,
      name: 'goodsDescImg',
      type: 'upload',
      maxFile: 20,
      hidden: goodsDescType !== '0',
      rules: [{ required: false }],
    },
    {
      type: 'noForm',
      visible: goodsDescType === '1',
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
          console.log(val);
          saveMreData(val);
          form.setFieldsValue({ merchantIds: val.keys, hexiaoIds: val.keys });
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
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(PreferentialSet);
