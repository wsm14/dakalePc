import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Tag } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import { GOODS_CLASS_TYPE, CONPON_RULES_GOODS_TYPE } from '@/common/constant';
import GoodsRuleModal from './GoodsRuleModal';

const FormItem = Form.Item;

/**
 * 商品
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ form, ruleShowApi }) => {
  const [visible, setVisible] = useState(false); // 选择店铺Modal
  const [shopData, setShopData] = useState({ subRuleType: 'specialGoods', list: [] }); // 暂存数据

  useEffect(() => {
    form.setFieldsValue({ ruleConditions: [] });
  }, [ruleShowApi]);

  // 特惠商品/电商品 表头
  const specialGoodsColumns = [
    {
      title: '商品信息',
      fixed: 'left',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <PopImgShow url={val} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              marginLeft: 5,
            }}
          >
            <div style={{ display: 'flex' }}>
              <Tag color={row.goodsType === 'single' ? 'orange' : 'magenta'}>
                {GOODS_CLASS_TYPE[row.goodsType]}
              </Tag>
              <Ellipsis length={10} tooltip>
                {row.goodsName}
              </Ellipsis>
            </div>
            <div style={{ marginTop: 5 }}>{row[listProps.id]}</div>
          </div>
        </div>
      ),
    },
    {
      title: '售价',
      dataIndex: 'oriPrice',
      show: ['specialGoods'].includes(shopData.subRuleType),
      render: (val, row) => {
        return <div>￥{Number(row.realPrice).toFixed(2)}</div>;
      },
    },
    {
      title: '售价',
      dataIndex: 'paymentModeObject',
      show: ['commerceGoods'].includes(shopData.subRuleType),
      render: (val = {}, row) => (
        <div>
          {val.type === 'self'
            ? `${val.bean || 0} 卡豆 + ${val.cash || 0} 元`
            : `${row.realPrice || 0} 元`}
        </div>
      ),
    },
    {
      type: 'handle',
      dataIndex: 'specialGoodsId',
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
        <div>
          <div>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div style={{ display: 'flex', marginTop: 5 }}>{`ID:${row.ownerCouponIdString}`}</div>
        </div>
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

  const handleDelect = (id) => {
    const newList = shopData.list.filter((item) => item[listProps.id] !== id);
    setShopData({ ...shopData, list: newList });
    form.setFieldsValue({
      remark: ['phoneBill', 'member'].includes(shopData.subRuleType)
        ? `已选${CONPON_RULES_GOODS_TYPE[shopData.subRuleType]}`
        : `已选${shopData.list.length}个${CONPON_RULES_GOODS_TYPE[shopData.subRuleType]}`,
      ruleConditions: newList.map((item) => ({
        condition: item[listProps.id],
      })),
    });
  };

  const listProps = {
    specialGoods: {
      getColumns: specialGoodsColumns,
      id: 'specialGoodsId',
    },
    reduceCoupon: {
      getColumns: ownerCouponColumns,
      id: 'ownerCouponIdString',
    },
    commerceGoods: {
      getColumns: specialGoodsColumns,
      id: 'specialGoodsId',
    },
  }[shopData.subRuleType];

  return (
    <>
      <FormItem label="指定商品" required>
        <Button type="link" onClick={() => setVisible(true)}>
          选择
        </Button>
        {shopData.list.length > 0
          ? `（已选${shopData.list.length}个${CONPON_RULES_GOODS_TYPE[shopData.subRuleType]}）`
          : ['phoneBill', 'member'].includes(shopData.subRuleType)
          ? `（已选${CONPON_RULES_GOODS_TYPE[shopData.subRuleType]}）`
          : ''}
      </FormItem>
      {['phoneBill', 'member'].includes(shopData.subRuleType) ? null : (
        <TableDataBlock
          noCard={false}
          columns={listProps.getColumns}
          rowKey={(record) => `${record[listProps.id]}`}
          list={shopData.list}
          total={shopData.list.length}
        ></TableDataBlock>
      )}
      {/* 选择指定商品 */}
      <GoodsRuleModal
        form={form}
        shopData={shopData}
        setShopData={setShopData}
        visible={visible}
        onClose={() => setVisible(false)}
      ></GoodsRuleModal>
      <FormItem label="ruleConditions" hidden name="ruleConditions">
        <Input />
      </FormItem>
      <FormItem label="subRuleType" hidden name="subRuleType">
        <Input />
      </FormItem>
      <FormItem label="remark" hidden name="remark">
        <Input />
      </FormItem>
    </>
  );
};

export default index;
