import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import ResourceContentForm from './ResourceContentForm';

const CouponDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading, loadingDetail } = props;

  const { type = 'add', show = false, detail = {} } = visible;
  const { resourceTemplateContentId } = detail;

  const [form] = Form.useForm();

  useEffect(() => {
    // 获取礼包类型
    dispatch({
      type: 'spreeManage/fetchListGiftType',
    });
    // 获取banner位置
    dispatch({
      type: 'sysAppList/fetchBannerRatio',
      payload: {
        userType: 'user',
        deleteFlag: 1,
      },
    });
  }, []);

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then(async (values) => {
      const {
        topImg,
        backgroundColor,
        image,
        mixedList,
        couponList,
        specialGoods,
        commerceGoods,
        selfTourGoods,
        brandSelfTravel,
        giftTypes = [],
        bannerType,
        ...other
      } = values;
      console.log('提交', values);

      delete other.activityGoodsTypeList;
      delete other.activityGoodsTypeSelfTravelList;

      const topImgUrl = await aliOssUpload(topImg);
      const imageUrl = await aliOssUpload(image);

      const data = {
        resourceTemplateContentId,
        ...other,
        contentInfo: {
          bannerType,
          topImg: topImgUrl.toString(),
          backgroundColor,
          giftTypes: giftTypes.toString(),
          image: imageUrl.toString(),
          mixedList: mixedList?.map((item) => ({
            activityGoodsId: item.activityGoodsId,
            ownerId: item.ownerIdString,
          })),
          couponList: couponList?.map((item) => ({
            ...item,
            platformCouponId: item.platformCouponId.platformCouponId,
          })),
          specialGoods: specialGoods?.map((item) => ({
            activityGoodsId: item.activityGoodsId,
            ownerId: item.ownerIdString,
          })),
          commerceGoods: commerceGoods?.map((item) => ({
            activityGoodsId: item.activityGoodsId,
            ownerId: item.ownerIdString,
          })),
          selfTourGoods: selfTourGoods?.map((item) => ({
            activityGoodsId: item.activityGoodsId,
            ownerId: item.ownerIdString,
          })),
          brandSelfTravel: brandSelfTravel?.map((item) => ({
            ...item,
            activityGoodsList: item.activityGoodsList?.map((i) => ({
              activityGoodsId: i.activityGoodsId,
              ownerId: i.ownerIdString,
            })),
          })),
        },
      };

      dispatch({
        type: {
          add: 'walkingManage/fetchSaveResourceTemplateContent',
          edit: 'walkingManage/fetchUpdateResourceTemplateContent',
        }[type],
        payload: data,
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 统一处理弹窗
  const drawerProps = {
    add: {
      title: '新增',
      children: <ResourceContentForm form={form} initialValues={detail}></ResourceContentForm>,
    },
    edit: {
      title: '编辑',
      children: (
        <ResourceContentForm type="edit" form={form} initialValues={detail}></ResourceContentForm>
      ),
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    loading: loadingDetail,
    footer: ['add', 'edit'].includes(type) && (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        保存
      </Button>
    ),
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['walkingManage/fetchSaveResourceTemplateContent'] ||
    loading.effects['walkingManage/fetchUpdateResourceTemplateContent'],
  loadingDetail:
    loading.effects['walkingManage/fetchGetResourceTemplateContentById'] ||
    loading.effects['spreeManage/fetchListGiftType'] ||
    loading.effects['sysAppList/fetchBannerRatio'],
}))(CouponDrawer);
