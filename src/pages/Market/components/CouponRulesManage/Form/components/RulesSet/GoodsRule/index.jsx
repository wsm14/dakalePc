import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Tag } from 'antd';
import {
  TAG_COLOR_TYPE,
  GOODS_CLASS_TYPE,
  CONPON_RULES_GOODS_TYPE,
  ELECTRICGOODS_SELL_PRICE_TYPE,
} from '@/common/constant';
import { Radio } from '@/components/FormCondition/formModule';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import GoodsSelectModal from '@/components/GoodsSelectModal';

const FormItem = Form.Item;

/**
 * 商品
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ form, ruleShowApi }) => {
  const subRuleType = Form.useWatch('subRuleType', form); // 商品类型监听

  const [visible, setVisible] = useState(false); // 选择店铺Modal
  const [shopData, setShopData] = useState([]); // 暂存数据

  useEffect(() => {
    form.setFieldsValue({ ruleConditions: [] });
  }, [ruleShowApi]);

  // 特惠商品/电商品 表头
  const specialGoodsColumns = [
    {
      title: '类型',
      dataIndex: 'productType',
      width: 60,
      align: 'center',
      show: ['specialGoods'].includes(subRuleType),
      render: (val) => <Tag color={TAG_COLOR_TYPE[val]}>{GOODS_CLASS_TYPE[val]}</Tag>,
    },
    {
      title: '商品信息',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PopImgShow url={val} width={60} />
          <div style={{ marginLeft: 5 }}>
            <Ellipsis length={10} tooltip>
              {row.goodsName}
            </Ellipsis>
            <div>{row.goodsId}</div>
          </div>
        </div>
      ),
    },
    {
      title: '售价',
      dataIndex: 'sellPrice',
      align: 'right',
      show: ['specialGoods'].includes(subRuleType),
      render: (val, row) => (
        <div>
          <div>
            {
              {
                defaultMode: `¥${val}`,
                cashMode: `¥${val}`,
                self: `¥${val}+${row.sellBean}卡豆`,
                free: '免费',
              }[row.paymentModeType]
            }
          </div>
          <div
            style={{
              textDecoration: 'line-through',
              color: '#9e9e9e',
            }}
          >
            ¥{row.oriPrice}
          </div>
          {row.paymentModeType !== 'free' && ELECTRICGOODS_SELL_PRICE_TYPE[row.paymentModeType]}
        </div>
      ),
    },
    {
      title: '售价',
      dataIndex: 'sellPriceRange',
      align: 'right',
      show: ['commerceGoods'].includes(subRuleType),
      render: (val, row) => `${val}\n${ELECTRICGOODS_SELL_PRICE_TYPE[row.paymentModeType]}`,
    },
    {
      type: 'handle',
      dataIndex: 'goodsId',
      width: 60,
      render: (val) => [
        {
          type: 'del',
          auth: true,
          click: () => handleDelect(val),
        },
      ],
    },
  ];

  //  有价券 表头
  const ownerCouponColumns = [
    {
      title: '券信息',
      fixed: 'left',
      dataIndex: 'couponName',
      render: (val, row) => (
        <>
          <div>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div style={{ display: 'flex' }}>{`ID:${row.ownerCouponIdString}`}</div>
        </>
      ),
    },
    {
      title: '售价',
      align: 'right',
      dataIndex: 'buyPrice',
      render: (val, row) => <div>￥{Number(val).toFixed(2)}</div>,
    },
    {
      type: 'handle',
      dataIndex: 'ownerCouponIdString',
      render: (val) => [
        {
          type: 'del',
          auth: true,
          click: () => handleDelect(val),
        },
      ],
    },
  ];

  // 商品类型选择充值类型处理
  const handleTypeSelectCheck = (e) => {
    const typeVal = e.target.value;
    if (['phoneBill', 'member'].includes(typeVal)) {
      form.setFieldsValue({
        remark: `已选${CONPON_RULES_GOODS_TYPE[typeVal]}`,
        ruleConditions: [{ condition: 'all' }],
      });
    } else {
      setShopData([]);
      form.setFieldsValue({ ruleConditions: [{ condition: [] }] });
    }
  };

  // 表格删除商品
  const handleDelect = (id) => {
    const newList = shopData.filter((item) => item.goodsId !== id);
    setShopData(newList);
    formGoodsData(newList);
  };

  // 商品处理完成form赋值
  const formGoodsData = (list) => {
    setShopData(list);
    form.setFieldsValue({
      remark: `已选${list.length}个${CONPON_RULES_GOODS_TYPE[subRuleType]}`,
      ruleConditions: list.map((item) => ({ condition: item.goodsId })),
    });
  };

  const listColumns = {
    specialGoods: specialGoodsColumns,
    reduceCoupon: ownerCouponColumns,
    commerceGoods: specialGoodsColumns,
  }[subRuleType];

  return (
    <>
      <FormItem
        label="商品类型"
        name="subRuleType"
        extra={
          ['phoneBill', 'member'].includes(subRuleType) &&
          `选择所有${CONPON_RULES_GOODS_TYPE[subRuleType]}商品参与`
        }
      >
        <Radio select={CONPON_RULES_GOODS_TYPE} onChange={handleTypeSelectCheck}></Radio>
      </FormItem>
      {/* 商品显示 */}
      {['specialGoods', 'reduceCoupon', 'commerceGoods'].includes(subRuleType) && (
        <FormItem label="指定商品" required>
          <Button type="link" onClick={() => setVisible(true)}>
            选择
          </Button>
          {shopData.length > 0
            ? `（已选${shopData.length}个${CONPON_RULES_GOODS_TYPE[subRuleType]}）`
            : ''}
        </FormItem>
      )}
      {/* 商品显示 */}
      {['specialGoods', 'reduceCoupon', 'commerceGoods'].includes(subRuleType) && (
        <TableDataBlock
          noCard={false}
          list={shopData}
          tableSize={'small'}
          total={shopData.length}
          columns={listColumns}
          rowKey={(record) => `${record.goodsId}`}
        ></TableDataBlock>
      )}
      {/* 选择指定商品 */}
      <GoodsSelectModal
        visible={visible}
        showTag={[subRuleType]}
        goodsValues={shopData}
        onSumbit={({ list }) => formGoodsData(list)}
        onClose={() => setVisible(false)}
      ></GoodsSelectModal>
      <FormItem label="ruleConditions" hidden name="ruleConditions">
        <Input />
      </FormItem>
      <FormItem label="remark" hidden name="remark">
        <Input />
      </FormItem>
    </>
  );
};

export default index;
