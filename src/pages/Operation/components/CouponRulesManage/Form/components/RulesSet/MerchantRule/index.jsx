import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, Input } from 'antd';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import { CONPON_RULES_BUSINESS_TYPE } from '@/common/constant';
import MerchantModal from './MerchantModal';

const FormItem = Form.Item;

/**
 * 店铺
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ form }) => {
  const [visible, setVisible] = useState(false); // 选择店铺Modal
  const [shopData, setShopData] = useState({ subRuleType: 'merchant', list: [] }); // 暂存数据

  useEffect(() => {
    form.setFieldsValue({ ruleConditions: [] });
    setShopData({
      subRuleType: 'merchant',
      list: [],
    });
  }, []);

  const getColumns = [
    {
      title: '店铺类型',
      dataIndex: 'groupType',
    },
    {
      title: '店铺名称',
      dataIndex: 'name',
    },
    {
      title: '店铺ID',
      dataIndex: 'id',
    },
    {
      title: '经营类目',
      dataIndex: 'topCategoryName',
      render: (val, row) => `${val}/${row.categoryName}`,
    },
    {
      title: '地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
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
      remark: `已选${newList.length}个${CONPON_RULES_BUSINESS_TYPE[shopData.subRuleType]}`,
      ruleConditions: newList.map((item) => ({
        condition: item.id,
      })),
    });
  };

  return (
    <>
      <FormItem label="指定店铺" required>
        <Button type="link" onClick={() => setVisible(true)}>
          选择
        </Button>
        {shopData.list.length > 0
          ? `（已选${shopData.list.length}个${CONPON_RULES_BUSINESS_TYPE[shopData.subRuleType]}）`
          : ''}
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
