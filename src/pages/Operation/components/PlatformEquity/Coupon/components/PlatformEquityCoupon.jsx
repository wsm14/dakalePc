import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import CouponDetail from './Detail/PlatformEquityCouponDetail';
import CouponSet from './Form/PlatformEquityCouponSet';
import aliOssUpload from '@/utils/aliOssUpload';

const CouponDrawer = (props) => {
  const { visible, dispatch, total, childRef, onClose, getDetail, loading, loadingDetail } = props;

  const { type = 'info', index, show = false, detail = {}, ownerCouponId, status } = visible;
  const [commissionShow, setCommissionShow] = useState(false);
  const [content, setContent] = useState(''); // 输入的富文本内容
  const [buyFlag, setBuyFlag] = useState('0'); // 商品购买类型
  const [merchantList, setMerchantList] = useState([]);
  const [form] = Form.useForm();

  //sku通用-审核中sku挂靠商家列表
  const getMerchantList = () => {
    dispatch({
      type: 'baseData/fetchSkuDetailMerchantList',
      payload: {
        ownerServiceId: ownerCouponId,
        ownerId: -1,
        relateId: detail.relateId,
        serviceType: 'reduceCoupon',
      },
      callback: (list) => setMerchantList(list),
    });
  };

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      const {
        activeDate,
        restrictions,
        couponDesc = [],
        timeSplit,
        timeType,
        useWeek,
        useTime,
        merchantIds = [],
        couponDetailImg,
        ...other
      } = values;
      const coupoImg = await aliOssUpload(couponDetailImg);

      dispatch({
        type: {
          add: 'couponManage/fetchPlatformEquityCouponSave',
          edit: 'couponManage/fetchPlatformEquityCouponUpdate',
          again: 'couponManage/fetchPlatformEquityCouponSave',
        }[type],
        payload: {
          ownerCouponId,
          ...other,
          rightFlag: 1,
          ownerType: 'admin',
          ownerId: -1,
          richText: content, // 富文本内容
          couponDetailImg: coupoImg.toString(),
          couponType: 'reduce',
          merchantIds: merchantIds.toString(),
          activeDate: activeDate && activeDate[0].format('YYYY-MM-DD'),
          endDate: activeDate && activeDate[1].format('YYYY-MM-DD'),
          useWeek: timeSplit !== 'part' ? timeSplit : useWeek.toString(),
          couponDesc: couponDesc.filter((i) => i),
          useTime:
            timeType !== 'part'
              ? timeType
              : `${useTime[0].format('HH:mm')}-${useTime[1].format('HH:mm')}`,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };
  const listProp = {
    buyFlag,
    setBuyFlag,
    commissionShow,
    setCommissionShow,
    type,
    status,
    ownerCouponId,
    setContent,
  };
  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '查看详情',
      children: <CouponDetail detail={detail} merchantList={merchantList}></CouponDetail>,
    },
    add: {
      title: '新建券',
      children: (
        <CouponSet
          {...listProp}
          form={form}
          initialValues={{
            relateType: 'merchant',
            couponDetailType: '1',
            paymentModeObject: { type: 'self' },
          }}
        ></CouponSet>
      ),
    },
    edit: {
      title: '编辑券',
      children: <CouponSet {...listProp} form={form} initialValues={detail}></CouponSet>,
    },
    again: {
      title: '重新发布',
      children: <CouponSet {...listProp} form={form} initialValues={detail}></CouponSet>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    afterCallBack: () => {
      if (detail.relateType === 'group') {
        getMerchantList();
      }
    },
    closeCallBack: () => dispatch({ type: 'baseData/clearGroupMre' }), // 关闭清空搜索的商家数据
    dataPage: type === 'info' && {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: ['add', 'edit', 'again'].includes(type) && (
      <Button
        onClick={handleUpAudit}
        type="primary"
        disabled={{ 0: false, 1: !commissionShow }[buyFlag]}
        loading={loading}
      >
        发布
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['couponManage/fetchPlatformEquityCouponSave'] ||
    loading.effects['couponManage/fetchPlatformEquityCouponUpdate'],
  loadingDetail: loading.effects['couponManage/fetchCouponDetail'],
}))(CouponDrawer);
