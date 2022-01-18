import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, Input, Tag } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import { SPECIAL_RECOMMEND_DELSTATUS, SPECIAL_STATUS } from '@/common/constant';
import MerchantModal from './MerchantModal';

const FormItem = Form.Item;

/**
 * 商品
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ form, ruleShowApi, dispatch }) => {
  const [visible, setVisible] = useState(false); // 选择店铺Modal
  const [shopData, setShopData] = useState({ subRuleType: 'specialGoods', list: [] }); // 暂存数据

  const getColumns = [
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
            <div style={{ display: 'flex', marginTop: 5 }}>
              <Tag>{BUSINESS_TYPE[row.ownerType]}</Tag>
              <Ellipsis length={10} tooltip>
                {row.ownerName}
              </Ellipsis>
            </div>
            <div style={{ marginTop: 5 }}>{54516541654156}</div>
          </div>
        </div>
      ),
    },
    {
      title: '售价',
      dataIndex: 'oriPrice',
      render: (val, row) => {
        const zhe = (Number(row.realPrice) / Number(val)) * 10;
        return (
          <div>
            <div style={{ textDecoration: 'line-through', color: '#999999' }}>
              ￥{Number(val).toFixed(2)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tag color={'red'}>{`${zhe}`.substring(0, 4)}折</Tag>
              <div>￥{Number(row.realPrice).toFixed(2)}</div>
            </div>
          </div>
        );
      },
    },
    {
      type: 'handle',
      dataIndex: 'id',
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
    const newList = shopData.list.filter((item) => item.id !== id);
    setShopData({ ...shopData, list: newList });
    form.setFieldsValue({
      remark: `（已选${newList.length}个单店/子门店）`,
      ruleConditions: newList,
    });
  };

  return (
    <>
      <FormItem label="指定商品" required>
        <Button type="link" onClick={() => setVisible(true)}>
          选择
        </Button>
        {shopData.list.length > 0 ? `（已选${shopData.list.length}个单店/子门店）` : ''}
      </FormItem>
      <TableDataBlock
        noCard={false}
        columns={getColumns}
        rowKey={(record) => `${record.id}`}
        list={shopData.list}
        total={shopData.list.length}
      ></TableDataBlock>
      <MerchantModal
        form={form}
        shopData={shopData}
        setShopData={setShopData}
        visible={visible}
        onClose={() => setVisible(false)}
      ></MerchantModal>
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

export default connect(({}) => ({}))(index);
