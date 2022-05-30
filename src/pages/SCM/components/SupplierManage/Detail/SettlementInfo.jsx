import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Spin, Empty } from 'antd';
import SearchCondition from '@/components/SearchCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const SettlementInfo = (props) => {
  const { dispatch, loading, supplierId } = props;

  const [supplierSettlementDetailList, setSupplierSettlementDetailList] = useState([]);

  useEffect(() => {
    fetchGetSettlement();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '',
      type: 'rangePicker',
      name: 'settleBeginTime',
      end: 'settleEndTime',
    },
  ];

  // 获取详情
  const fetchGetSettlement = (values = {}) => {
    dispatch({
      type: 'supplierSettlement/fetchGetList',
      payload: { supplierId, page: 1, limit: 999, ...values },
      callback: (list) => {
        setSupplierSettlementDetailList(list);
      },
    });
  };

  const itemArr = [
    {
      label: '结算金额',
      name: 'settleAmount',
    },
    {
      label: '付款方户名',
      name: 'legalPerson',
    },
    {
      label: '付款方账号',
      name: 'cardNo',
    },
    {
      label: '付款方银行',
      name: 'bankBranchName',
    },
    {
      label: '结算流水号',
      name: 'settleNum',
    },
    {
      label: '交易时间',
      name: 'settleTime',
    },
    {
      label: '凭证',
      type: 'upload',
      name: 'certificate',
    },
    {
      label: '备注',
      name: 'remarks',
    },
  ];

  return (
    <>
      <SearchCondition
        colForm={{ xxl: 24 }}
        searchItems={searchItems}
        handleSearch={fetchGetSettlement}
      ></SearchCondition>
      <Spin spinning={loading}>
        {supplierSettlementDetailList.length ? (
          supplierSettlementDetailList.map((data, index) => (
            <DescriptionsCondition
              key={`${index}${index}`}
              formItems={itemArr}
              initialValues={data}
            ></DescriptionsCondition>
          ))
        ) : (
          <Empty></Empty>
        )}
      </Spin>
    </>
  );
};

export default connect(({ supplierSettlement, loading }) => ({
  supplierSettlement,
  loading: loading.models.supplierSettlement,
}))(SettlementInfo);
