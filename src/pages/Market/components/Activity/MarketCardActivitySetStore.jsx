import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form } from 'antd';
import { NUM_INT } from '@/common/regExp';
import moment from 'moment';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const MarketCardActivitySetStore = (props) => {
  const {
    marketCardActivity,
    dispatch,
    cRef,
    visible,
    onClose,
    loading,
    merchantList,
    storeId: activityId,
  } = props;

  const { typeList } = marketCardActivity;

  const [form] = Form.useForm();
  const [limitStaut, setLimitStaut] = useState(true);

  useEffect(() => {
    dispatch({
      type: 'marketCardActivity/clearMerchantList',
    });
  }, [visible]);

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const {
        allImgs: { fileList: afile },
        couponBanner: { fileList: bfile },
        activeBeginDate: time,
        acquireLimit: limit,
        acquireLimitNum: limitNum,
        categoryCustomId,
        goodsName,
        originPrice,
      } = values;

      // 上传图片到oss -> 提交表单
      aliOssUpload([afile[0].originFileObj, bfile[0].originFileObj]).then((res) => {
        dispatch({
          type: 'marketCardActivity/fetchMarketActivityStoreSet',
          payload: {
            ...values,
            activityId,
            goodsObjectList: {
              categoryCustomId,
              price: originPrice,
              goodsName,
              allImgs: res[0],
            },
            allImgs: res[0],
            couponBanner: res[1],
            acquireLimit: { 0: limitNum, 1: '' }[limit],
            activeBeginDate: time[0].format('YYYY-MM-DD 00:00:00'),
            activeEndDate: time[1].format('YYYY-MM-DD 00:00:00'),
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  // 输入商家名称查找商家
  const handleOnSearchStore = (merchantName) => {
    dispatch({
      type: 'marketCardActivity/fetchMarketActivityStoreName',
      payload: {
        merchantName,
        page: 1,
        limit: 10,
      },
    });
  };

  // 选择商家后搜索商品分类
  const handleStoreGoodsType = (merchantId) => {
    dispatch({
      type: 'marketCardActivity/fetchStoreGoodsType',
      payload: {
        merchantId,
      },
    });
  };

  const formItems = [
    {
      label: '商家名称',
      name: 'merchant_id',
      type: 'select',
      onSearch: handleOnSearchStore,
      onChange: (val) => {
        handleStoreGoodsType(val);
        form.setFieldsValue({ categoryCustomId: undefined });
      },
      select: merchantList.map((item) => ({
        value: item.userMerchantIdString,
        name: item.merchantName,
      })),
    },
    {
      label: '活动商品',
      name: 'goodsName',
      maxLength: 20,
    },
    {
      label: '商品分类',
      type: 'select',
      name: 'categoryCustomId',
      select: typeList.map((item) => ({
        value: item.categoryCustomId,
        name: item.categoryName,
      })),
    },
    {
      label: '活动图',
      type: 'upload',
      maxFile: 1,
      name: 'couponBanner',
    },
    {
      label: '商品图',
      type: 'upload',
      maxFile: 1,
      name: 'allImgs',
    },
    {
      label: '活动数量',
      type: 'number',
      name: 'totalCount',
      addRules: [{ pattern: NUM_INT, message: '活动数量应为整数' }],
    },
    {
      label: '活动价',
      type: 'number',
      name: 'currentPrice',
    },
    {
      label: '原价',
      type: 'number',
      name: 'originPrice',
    },
    {
      label: '有效期',
      type: 'rangePicker',
      name: 'originPrisce',
      name: 'activeBeginDate',
      disabledDate: (time) => time && time < moment().endOf('day'),
    },
    {
      label: '限购',
      type: 'radio',
      name: 'acquireLimit',
      select: ['限购', '不限'],
      onChange: (e) => {
        setLimitStaut(e.target.value === '1');
        form.setFieldsValue({ acquireLimitNum: '' });
      },
    },
    {
      label: '每人每天限购',
      type: 'number',
      name: 'acquireLimitNum',
      disabled: limitStaut,
      rules: [
        { required: !limitStaut, message: `请确认每人每天限购数量` },
        { pattern: NUM_INT, message: '限购数量应为整数' },
      ],
    },
    {
      type: 'textArea',
      label: '优惠规则',
      name: 'descriptiosn',
    },
    {
      type: 'textArea',
      label: '购买须知',
      name: 'description',
    },
  ];

  const modalProps = {
    title: '新增商家',
    width: 560,
    visible,
    maskClosable: true,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={fetchGetFormData} type="primary" loading={loading}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <FormCondition formItems={formItems} form={form} loading={loading} />
    </Drawer>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  marketCardActivity,
  merchantList: marketCardActivity.merchantList.list,
  loading: loading.models.marketCardActivity,
}))(MarketCardActivitySetStore);
