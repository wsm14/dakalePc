import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import ProceDataForm from './Form/ProceDataForm';

const MerchantTab = (props) => {
  const { loading, list } = props;
  const [visible, setVisible] = useState(false);
  const childRef = useRef();

  //编辑
  const handleEdit = (row) => {
    const { provinceCode, cityCode, monthIsFree } = row;
    const code = provinceCode ? provinceCode.split(',') : [];
    code.push(cityCode);
    setVisible({
      type: 'edit',
      show: true,
      detail: {
        ...row,
        monthIsFree: Number(monthIsFree),
        areaCode: code,
      },
    });
  };

  const getColumns = [
    {
      title: '地区',
      fixed: 'left',
      dataIndex: 'areaType',
      render: (val, row) => <>{val == 'all' ? '通用' : `${row.provinceName}-${row.cityName}`}</>,
    },
    {
      title: '手续费规则',
      align: 'center',
      dataIndex: 'handlingFeeList',
      render: (val) =>
        val.map((item) => (
          <div key={item.maxMoney}>
            {item.maxMoney && item.minMoney == '0'
              ? item.maxMoney + '以下'
              : item.minMoney + '以上'}
            ：{item.handlingFee == '0' ? '免提现手续费' : item.handlingFee + '元'}
          </div>
        )),
    },
    {
      title: '文案内容',
      align: 'center',
      dataIndex: 'contentList',
      width: 500,
      render: (val) =>
        val.map((itemCon, indexs) => (
          <div style={{ textAlign: 'left' }} key={indexs}>
            {indexs + 1}、{itemCon}
          </div>
        )),
    },
    {
      title: '最后修改人',
      align: 'center',
      dataIndex: 'updater',
    },
    {
      title: '最后修改日期',
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      type: 'handle',
      dataIndex: 'city',
      render: (val, row) => [
        {
          type: 'edit',
          click: () => handleEdit(row),
        },
      ],
    },
  ];

  // 权限按钮
  const btnList = [{ onClick: () => setVisible({ type: 'add', show: true }) }]; // 新增按钮

  return (
    <>
      <TableDataBlock
        order
        keepData
        cardProps={{
          title: '店铺',
          bordered: false,
          extra: <ExtraButton list={btnList}></ExtraButton>,
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.configWithdrawId}`}
        dispatchType="widthdrawRegularList/fetchWithdrawRegularList"
        {...list}
      ></TableDataBlock>
      {/* 新增，编辑 */}
      <ProceDataForm
        visible={visible}
        onClose={() => setVisible(false)}
        childRef={childRef}
      ></ProceDataForm>
    </>
  );
};
export default connect(({ widthdrawRegularList, loading }) => ({
  list: widthdrawRegularList.list,
  loading: loading.models.widthdrawRegularList,
}))(MerchantTab);
