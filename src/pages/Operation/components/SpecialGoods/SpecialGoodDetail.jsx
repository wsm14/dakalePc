import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Tabs, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import GoodsDetailForm from './Detail/GoodsDetail';
import RegularDetail from './Detail/RegularDetail';
import ExtraButton from '@/components/ExtraButton';
import FormCondition from '@/components/FormCondition';
import CheckRecord from '@/components/CheckRecord';

const SpecialGoodDetail = (props) => {
  const { visible, onClose, onEdit, total, getDetail, loading, dispatch } = props;
  const { show = false, detail = {}, status, goodsId, ownerId } = visible;

  const [form] = Form.useForm();
  const [merchantList, setMerchantList] = useState([]);

  const handleEdit = () => {
    onClose(), onEdit();
  };

  useEffect(() => {
    if (show && detail.relateType === 'group') {
      const { relationOwnerInfoResps = [] } = detail;
      if (relationOwnerInfoResps.length) {
        setMerchantList([...relationOwnerInfoResps]);
      }
    }
  }, [show]);

  //sku通用-审核中sku挂靠商家列表
  const getMerchantList = () => {
    dispatch({
      type: 'baseData/fetchSkuDetailMerchantList',
      payload: {
        ownerServiceId: goodsId,
        ownerId: ownerId,
        serviceType: 'specialGoods',
      },
      callback: (list) => setMerchantList(list),
    });
  };
  const btnList = [
    {
      auth: 'edit',
      onClick: handleEdit,
      text: '编辑',
      show: ['1'].includes(status),
    },
  ];
  // 弹出窗属性
  const modalProps = {
    title: '活动详情',
    visible: show,
    loading,
    onClose,
    footer: <ExtraButton list={btnList}></ExtraButton>,
  };
  return (
    <DrawerCondition {...modalProps}>
      <GoodsDetailForm detail={detail} form={form} merchantList={merchantList}></GoodsDetailForm>
      <RegularDetail detail={detail}></RegularDetail>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsDetail'],
}))(SpecialGoodDetail);
