import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Tabs, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import ExtraButton from '@/components/ExtraButton';
import FormCondition from '@/components/FormCondition';
import GoodsDetailForm from './Detail/GoodsDetail';
import RegularDetail from './Detail/RegularDetail';

const PlatformEquityGoodsDetail = (props) => {
  const { visible, onClose, onEdit, total, getDetail, loading, dispatch } = props;
  const { show = false, index, detail = {}, status, specialGoodsId } = visible;

  const [form] = Form.useForm();
  const [merchantList, setMerchantList] = useState([]);

  const handleEdit = () => {
    onClose(), onEdit();
  };

  useEffect(() => {
    if (show && detail.relateType === 'group') {
      getMerchantList();
    }
  }, [show]);

  //sku通用-审核中sku挂靠商家列表
  const getMerchantList = () => {
    dispatch({
      type: 'baseData/fetchSkuDetailMerchantList',
      payload: {
        ownerServiceId: specialGoodsId,
        ownerId: -1,
        relateId: detail.relateId,
        serviceType: 'rightGoods',
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
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: <ExtraButton list={btnList}></ExtraButton>,
  };

  return (
    <DrawerCondition {...modalProps}>
      {/* 信息展示 */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="商品信息" key="1">
          <GoodsDetailForm
            detail={detail}
            form={form}
            merchantList={merchantList}
          ></GoodsDetailForm>
        </Tabs.TabPane>
        <Tabs.TabPane tab="投放规则" key="2">
          <RegularDetail detail={detail}></RegularDetail>
        </Tabs.TabPane>
      </Tabs>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsDetail'],
}))(PlatformEquityGoodsDetail);
