import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import { CONPON_RULES_BUSINESS_TYPE } from '@/common/constant';
import MerchantModal from './MerchantModal';

const FormItem = Form.Item;

/**
 * 店铺
 * @param {String} ruleShowApi 选择的规则类型
 */
const index = ({ mode, detail = {}, form, ruleShowApi, categoryCascaderList, dispatch }) => {
  const [visible, setVisible] = useState(false); // 选择店铺Modal
  const [shopData, setShopData] = useState({ subRuleType: 'merchant', list: [] }); // 暂存数据

  // useEffect(() => {
  //   if (mode === 'edit') {
  //     setShopData({ subRuleType: detail.subRuleType, list: form.get('ruleConditions') });
  //   }
  // }, []);

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
      title: '店铺账号',
      dataIndex: 'mobile',
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
      dataIndex: 'url',
      render: (val) => [
        {
          type: 'del',
          auth: true,
          click: () => console.log('del'),
        },
      ],
    },
  ];

  return (
    <>
      <FormItem label="指定店铺" required>
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
      <FormItem label="ruleConditions" hidden name="ruleConditions"></FormItem>
    </>
  );
};

export default connect(({ sysTradeList }) => ({
  categoryCascaderList: sysTradeList.categoryCascaderList,
}))(index);
