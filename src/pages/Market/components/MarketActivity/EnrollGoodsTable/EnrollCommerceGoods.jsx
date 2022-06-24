import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

// 电商品
const EnrollCommerceGoods = (props) => {
  const { dispatch, id, tableRef, onlineGoods, classifyList, loading } = props;

  useEffect(() => {
    fetchGetGoodsClassify();
  }, []);

  // 获取电商品后台类目
  const fetchGetGoodsClassify = () => {
    dispatch({ type: 'baseData/fetchParentListClassify' });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '供应商名称',
      name: 'relateId',
      type: 'supplier',
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '类目',
      name: 'categoryId',
      type: 'cascader',
      select: classifyList,
      fieldNames: { label: 'classifyName', value: 'classifyId', children: 'childList' },
    },
  ];

  const getColumns = [
    {
      title: '供应商名称',
      align: 'center',
      dataIndex: 'relateName',
      ellipsis: true,
    },
    {
      title: '参与活动商品名称/ID',
      dataIndex: 'goodsName',
      render: (val, row) => (
        <div>
          <Ellipsis length={10} tooltip>
            {val}
          </Ellipsis>
          <div>{row.goodsId}</div>
        </div>
      ),
    },
    {
      title: '类目',
      dataIndex: 'categoryName',
    },
    {
      title: '当前售价',
      align: 'right',
      dataIndex: 'dd',
      render: (val, row) => tabPriceShow('sellPrice', row),
    },
    {
      title: '当前商家结算价',
      align: 'right',
      dataIndex: 'cc',
      render: (val, row) => tabPriceShow('settlePrice', row),
    },
    {
      title: '活动售价',
      align: 'right',
      dataIndex: 'bb',
      render: (val, row) => tabPriceShow('activitySellPrice', row),
    },
    {
      title: '活动结算价',
      align: 'right',
      dataIndex: 'aa',
      render: (val, row) => tabPriceShow('activitySettlePrice', row),
    },
    {
      title: '活动库存',
      align: 'right',
      dataIndex: 'skuCount',
      render: (val, row) => (
        <>
          {checkKeyMaxMin({ key: 'activityRemain', data: row.skuList })}
          <Button type="link">查看</Button>
        </>
      ),
    },
  ];

  const tabPriceShow = (key, row) => (
    <>
      {checkKeyMaxMin({ key, data: row.skuList, payType: row.payType })}
      <Button type="link">查看</Button>
    </>
  );

  /**
   * sku数据回显处理
   * @param {String} key 处理的key
   * @param {Array} data sku数据列表
   * @param {String} payType 支付类型 self特殊处理
   * @returns
   */
  const checkKeyMaxMin = ({ key, data = [], payType }) => {
    if (!data.length) return '';
    // 遍历值
    const valueArr = data.map((item) => {
      if (payType === 'self') {
        return item['activitySellBean'] + item['activitySellPrice'] * 100;
      }
      if (item[key] === undefined) {
        return '';
      } else {
        return item[key];
      }
    });

    // 最大值
    const maxNum = Math.max.apply(Math, valueArr) || 0;
    // 最小值
    const minNum = Math.min.apply(Math, valueArr) || 0;

    if (payType === 'self') {
      const maxIndex = valueArr.indexOf(maxNum); // 最大值下标
      const minIndex = valueArr.indexOf(minNum); // 最小值下标
      const maxText = `${data[maxIndex]['activitySellBean']}卡豆 + ￥${data[maxIndex]['activitySellPrice']}`;
      const minText = `${data[minIndex]['activitySellBean']}卡豆 + ￥${data[minIndex]['activitySellPrice']}`;
      if (maxIndex === minIndex) {
        return minText;
      }
      return `${minText}\n~${maxText}`;
    }

    // 显示区间
    let num = `${minNum}~${maxNum}`;

    // 最高最低相同只显示一个
    if (minNum === maxNum) {
      num = minNum;
    }

    // 显示价格
    return num || 0;
  };

  return (
    <div style={{ width: 1050 }}>
      <TableDataBlock
        order
        noCard={false}
        cRef={tableRef}
        tableSize="small"
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        scroll={{ x: 1250, y: 400 }}
        rowKey={(row) => `${row.goodsId}`}
        params={{ marketingActivityId: id }}
        dispatchType="marketActivity/fetchMarketActivityOnlineGoods"
        {...onlineGoods}
      ></TableDataBlock>
    </div>
  );
};

export default connect(({ baseData, marketActivity, loading }) => ({
  classifyList: baseData.classifyParentList,
  onlineGoods: marketActivity.onlineGoods,
  loading:
    loading.effects['marketActivity/fetchMarketActivityOnlineGoods'] ||
    loading.effects['marketActivity/fetchMarketActivityGoodsEditRemain'],
}))(EnrollCommerceGoods);
