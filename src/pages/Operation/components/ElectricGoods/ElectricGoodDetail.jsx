import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import {
  ELECTRICGOODS_SELL_STATUS,
  ELECTRICGOODS_SELL_PRICE_TYPE,
  ELECTRIC_GOODS_COMMISSION,
  FRONT_SHOW_TYPE,
  SETTLE_TYPE,
  ASTRICT_BUY,
} from '@/common/constant';
import ExtraButton from '@/components/ExtraButton';
import SkuListTable from './Detail/SkuListTable';

const ElectricGoodDetail = (props) => {
  const { visible, onClose, onEdit, total, getDetail, loading, dispatch } = props;
  const { show = false, index, detail = {}, status } = visible;
  const { categoryNode, customSize = [] } = detail;

  const [form] = Form.useForm();
  const [merchantList, setMerchantList] = useState([]);
  const [commissionShow, setCommissionShow] = useState(false); // 佣金设置显示隐藏
  const [manualList, setManualList] = useState([]); // 分佣模版字段

  const handleEdit = () => {
    onClose(), onEdit();
  };

  useEffect(() => {
    if (show) {
      getCommissionFlag(categoryNode[0] || '');
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
        setCommissionShow(manuallyFlag);
        setManualList(manualDivisions || []);
      },
    });
  };

  const BasicsformItems = [
    {
      label: `供应商`,
      name: 'relateName',
    },
    {
      label: `商品类目`,
      name: 'brandName',
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
      name: 'brandName',
    },
    {
      label: `商品轮播图`,
      name: 'goodsBriefImg',
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
    },
    {
      label: `规格`,
      name: 'customSize',
      render: (val) =>
        val.map((item, index) => {
          return (
            <div key={index}>
              <div
                style={{
                  display: 'inline-block',
                  margin: '0 0 5px',
                  width: 50,
                  textAlign: 'center',
                }}
              >
                {item.name}
              </div>
              {item.value.map((it, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      display: 'inline-block',
                      marginLeft: 5,
                      padding: '0px 15px',
                      border: '1px solid #ccc',
                    }}
                  >
                    {it}
                  </div>
                );
              })}
            </div>
          );
        }),
    },
    {
      label: `原价`,
      name: 'oriPrice',
      show: customSize.length == 0,
      render: (val) => `￥${val}`,
    },
    {
      label: `成本价`,
      name: 'costPrice',
      show: customSize.length == 0,
      render: (val) => `￥${val}`,
    },
    {
      label: `结算价`,
      name: 'settlePrice',
      show: customSize.length == 0,
      render: (val) => `￥${val}`,
    },
    {
      label: `售卖价格类型`,
      name: 'paymentModeType',
      render: (val) => ELECTRICGOODS_SELL_PRICE_TYPE[val],
    },
    {
      label: `零售价`,
      name: 'sellPrice',
      show: customSize.length == 0,
      render: (val, row) =>
        row == 'self' ? `￥${val}+${row.sellBean}卡豆` : row == 'free' ? '免费' : `￥${val}`,
    },
    {
      label: `商品库存`,
      name: 'initStock',
      show: customSize.length == 0,
    },
    {
      label: `规格信息`,
      show: customSize.length != 0,
      render: () => <SkuListTable detail={detail} type="info"></SkuListTable>,
    },
  ];

  const SaleRuleformItems = [
    {
      label: `购买上限`,
      name: 'buyLimitRuleObject',
      render: (val) => (
        <>
          <div>{ASTRICT_BUY[val?.type]}</div>
          {val && val?.type != 'unlimited' && <div>{`单人最高购买份数：${val?.limitNum}份`}</div>}
        </>
      ),
    },
  ];

  const DivideformItems = [
    ...manualList?.map((i) => ({
      label: `${ELECTRIC_GOODS_COMMISSION[i.divisionParticipantType]}`,
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
      name: ['settleInfoReq', 'settlerType'],
      // render: (val) => SETTLE_TYPE[val],
      render: () => '平台',
    },
    // {
    //   label: `结算供应商`,
    //   name: ['settleInfoReq', 'settlerName'],
    // },
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
    title: '商品详情',
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
      <DescriptionsCondition
        title="销售规则"
        formItems={SaleRuleformItems}
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
