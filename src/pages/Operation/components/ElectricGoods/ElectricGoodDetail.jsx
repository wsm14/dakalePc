import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Tabs, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import {
  ELECTRICGOODS_SELL_STATUS,
  ELECTRICGOODS_SKU,
  ELECTRICGOODS_SELL_PRICE_TYPE,
  COMMISSION_TYPE,
  FRONT_SHOW_TYPE,
  SETTLE_TYPE,
} from '@/common/constant';
import GoodsDetailForm from './Detail/GoodsDetail';
import RegularDetail from './Detail/RegularDetail';
import ExtraButton from '@/components/ExtraButton';
import FormCondition from '@/components/FormCondition';
import CheckRecord from '@/components/CheckRecord';

const ElectricGoodDetail = (props) => {
  const { visible, onClose, onEdit, total, getDetail, loading, dispatch } = props;
  const { show = false, index, detail = {}, status, initialValues = {} } = visible;

  const [form] = Form.useForm();
  const [merchantList, setMerchantList] = useState([]);
  const [commissionShow, setCommissionShow] = useState(false); // 佣金设置显示隐藏
  const [manualList, setManualList] = useState([]); // 分佣模版字段

  const handleEdit = () => {
    onClose(), onEdit();
  };

  useEffect(() => {
    const { categoryNode } = detail;
    if (show) {
      getCommissionFlag(categoryNode.split('.')[0] || '');
    }
    // if (show && detail.ownerType === 'group') {
    //   getMerchantList();
    // }
  }, [show]);

  //sku通用-是否需要设置佣金
  const getCommissionFlag = (categoryId) => {
    dispatch({
      type: 'baseData/fetchGoodsIsCommission',
      payload: {
        serviceType: 'commerceGoods',
        categoryId: categoryId,
      },
      callback: ({ manuallyFlag, manualDivisions }) => {
        console.log('manuallyFlag: ', manuallyFlag);
        console.log('manualDivisions: ', manualDivisions);
        setCommissionShow(manuallyFlag);
        setManualList(manualDivisions || []);
      },
    });
  };

  const BasicsformItems = [
    {
      label: `供应商`,
      name: 'relateId',
      maxLength: 20,
    },
    {
      label: `商品类目`,
      name: 'categoryNode',
    },
    {
      label: `商品编码`,
      name: 'goodsCode',
    },
    {
      label: `商品名称`,
      name: 'goodsName',
    },
    {
      label: `商品ID`,
      name: 'goodsId',
    },
    {
      label: `品牌`,
      name: 'brandIdName',
    },
    {
      label: `商品轮播图`,
      name: 'goodsDescImg',
      type: 'upload',
    },
  ];

  const SaleformItems = [
    {
      label: `售卖类型`,
      name: 'sellType',
      render: (val) => ELECTRICGOODS_SELL_STATUS[val],
    },
    {
      label: `库存单位`,
      name: 'stockUnit',
      render: (val) => ELECTRICGOODS_SKU[val],
    },
    {
      label: `规格`,
      name: 'customSize',
      render: (val) => '',
    },
    {
      label: `售卖价格类型`,
      name: 'paymentModeType',
      render: (val) => ELECTRICGOODS_SELL_PRICE_TYPE[val],
    },
    {
      label: `规格信息`,
      // name: 'customSize',
      render: (val) => '123',
    },
    // {
    //   label: `商品库存`,
    //   name: 'initStock',
    // },
  ];

  const DivideformItems = [
    {
      label: `平台商品标签`,
      name: 'platformTagNames',
    },
    ...manualList?.map((i) => ({
      label: `${COMMISSION_TYPE['commerceGoods'][i.divisionParticipantType]}`,
      name: ['divisionParamInfoReq', `${i.divisionParticipantType}Bean`],
    })),
  ];
  const ShowformItems = [
    {
      label: `前端展示类型`,
      name: 'displayType',
      render: (val) => FRONT_SHOW_TYPE[val],
    },
    {
      label: `平台商品标签`,
      name: 'platformTagNames',
    },
    {
      label: `展示标签`,
      name: 'displayFilterTags',
    },
  ];
  const DeliverformItems = [
    {
      label: `发货地`,
      name: ['shippingRuleObject', 'shippingAddress'],
    },
    {
      label: `发货时效`,
      name: ['shippingRuleObject', 'shippingTime'],
      render: (val, row) => {
        const { returnRuleObject } = row;
        return (
          <div>
            <div>{val}</div>
            <div>{`${returnRuleObject.returnFlag == 1 ? '支持' : '不支持'}七天无理由退换货`}</div>
          </div>
        );
      },
    },
    {
      label: `运费`,
      name: ['postageRuleObject', 'type'],
      render: (val, row) =>
        val == 'free' ? (
          '免邮'
        ) : (
          <div>
            <div>全国统一价</div>
            <div>{`（￥${row?.postageRuleObject?.fee}）`}</div>
          </div>
        ),
    },
  ];
  const SettleformItems = [
    {
      label: `结算人类型`,
      name: ['settleObject', 'settlerType'],
      render: (val) => SETTLE_TYPE[val],
    },
    {
      label: `结算供应商`,
      name: ['settleObject', 'settlerId'],
      // render:(val)=>SETTLE_TYPE[val]
    },
  ];

  const GoodsformItems = [
    {
      label: `商品介绍`,
      name: 'richText',
      render: (val) => <div dangerouslySetInnerHTML={{ __html: val }}></div>,
    },
  ];

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
      {/* 驳回原因
      {status == '4' && <Alert message={`驳回原因：${detail.failureReason}`} type="error" banner />} */}
      {/* 信息展示 */}
      <DescriptionsCondition
        title="基础信息"
        formItems={BasicsformItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="销售信息"
        formItems={SaleformItems}
        initialValues={detail}
      ></DescriptionsCondition>
      {commissionShow === '1' && (
        <DescriptionsCondition
          title="分佣设置"
          formItems={DivideformItems}
          initialValues={detail}
        ></DescriptionsCondition>
      )}
      <DescriptionsCondition
        title="展示规则"
        formItems={ShowformItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="发货设置"
        formItems={DeliverformItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="结算设置"
        formItems={SettleformItems}
        initialValues={detail}
      ></DescriptionsCondition>
      <DescriptionsCondition
        title="商品介绍"
        formItems={GoodsformItems}
        initialValues={detail}
      ></DescriptionsCondition>
      {/* 审核时输入 其他平台价格
      {status == '3' && (
        <FormCondition formItems={formItems} form={form} style={{ marginTop: 10 }}></FormCondition>
      )} */}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsDetail'],
}))(ElectricGoodDetail);
