import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Button, Tabs, Alert, Form, notification } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import GoodsDetailForm from './Detail/GoodsDetail';
import RegularDetail from './Detail/RegularDetail';
import ExtraButton from '@/components/ExtraButton';
import FormCondition from '@/components/FormCondition';

const SpecialGoodDetail = (props) => {
  const { visible, onClose, onEdit, total, getDetail, loading, dispatch } = props;
  const { show = false, index, detail = {}, status, specialGoodsId, ownerIdString } = visible;

  const [form] = Form.useForm();
  const [merchantList, setMerchantList] = useState([]);

  const handleEdit = () => {
    onClose(), onEdit();
  };

  useEffect(() => {
    if (show && detail.ownerType === 'group') {
      getMerchantList();
    }
  }, [show]);

  //sku通用-审核中sku挂靠商家列表
  const getMerchantList = () => {
    dispatch({
      type: 'baseData/fetchSkuDetailMerchantList',
      payload: {
        ownerServiceId: specialGoodsId,
        ownerId: ownerIdString,
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
      show: ['1', '2'].includes(status),
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

  // const formItems = [
  //   {
  //     label: `其他平台价格`,
  //     name: 'otherPlatformPrice',
  //     maxLength: 20,
  //   },
  // ];

  return (
    <DrawerCondition {...modalProps}>
      {/* 驳回原因
      {status == '4' && <Alert message={`驳回原因：${detail.failureReason}`} type="error" banner />} */}
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
      {/* 审核时输入 其他平台价格
      {status == '3' && (
        <FormCondition formItems={formItems} form={form} style={{ marginTop: 10 }}></FormCondition>
      )} */}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsDetail'],
}))(SpecialGoodDetail);
