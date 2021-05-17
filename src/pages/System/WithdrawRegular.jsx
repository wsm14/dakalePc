import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import { connect } from 'umi';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import ProceDataForm from './components/Withdraw/Form/ProceDataForm';
import moment from 'moment';

const WithdrawRegular = (props) => {
  const { loading, list } = props;
  const [visible, setVisible] = useState(false);
  const childRef = useRef();

  //编辑
  const handleEdit = (row) => {
    const { provinceCode, cityCode } = row;
    const code = provinceCode ? provinceCode.split(',') : [];
    code.push(cityCode);
    setVisible({
      type: 'edit',
      show: true,
      detail: {
        ...row,
        areaCode: code,
        effectiveTime: moment(row.effectiveTime, 'YYYY-MM-DD HH:mm:ss'),
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
      render: (val, row) => (
        <>
          {val.map((item) => (
            <div key={item.maxMoney}>
              {(item.maxMoney && item.minMoney == '0')
                ? item.maxMoney + '以下'
                : item.minMoney + '以上'}
              ：{item.handlingFee == '0' ? '免提现手续费' : item.handlingFee + '元'}
            </div>
          ))}
        </>
      ),
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
      title: '生效时间',
      align: 'center',
      dataIndex: 'effectiveTime',
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
      title: '操作',
      align: 'center',
      dataIndex: 'city',
      render: (val, row) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => handleEdit(row),
            },
            // {
            //   type: 'edit',
            //   title: '日志',
            // },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        keepData
        cardProps={{
          title: '店铺',
          bordered: false,
          extra: (
            <AuthConsumer auth="save">
              <Button type="primary" onClick={() => setVisible({ type: 'add', show: true })}>
                新增
              </Button>
            </AuthConsumer>
          ),
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
}))(WithdrawRegular);
