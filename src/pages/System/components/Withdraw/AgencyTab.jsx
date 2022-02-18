import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { AGENCY_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import ProceDataForm from './Form/ProceDataForm';

const AgencyTab = (props) => {
  const { loading, list, tabkey } = props;
  const [visible, setVisible] = useState(false);
  const childRef = useRef();

  //编辑
  const handleEdit = (row) => {
    const { provinceCode, cityCode, monthIsFree, userType } = row;
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
      userType,
    });
  };

  const getColumns = [
    {
      title: '代理商级别',
      fixed: 'left',
      dataIndex: 'userType',
      render: (val) => AGENCY_TYPE[val],
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

  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.configWithdrawId}`}
        params={{ userTypes: tabkey }}
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
}))(AgencyTab);
