import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { BUSINESS_DETAIL_AUDIT } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const BusinessAuditDetailList = (props) => {
  const { businessAudit, loading, visible = false, setVisible } = props;

  // 搜索参数
  const propItem = {
    title: `审核记录`,
    dispatchType: 'businessAudit/fetchGetDetailList',
    rowKey: 'userMerchantVerifyRecordId',
    searchItems: [
      {
        label: '店铺名称',
        name: 'merchantName',
      },
      {
        label: '审核人',
        name: 'verifierName',
      },
      {
        label: '审核状态',
        name: 'verifyStatus',
        type: 'select',
        select: BUSINESS_DETAIL_AUDIT,
      },
    ],

    getColumns: [
      {
        title: '店铺账号',
        fixed: 'left',
        dataIndex: 'mobile',
        render: (val) => val || '暂未授权',
      },
      {
        title: '店铺名称',
        fixed: 'left',
        dataIndex: 'merchantName',
        ellipsis: true,
      },
      {
        title: '所在城市',
        dataIndex: 'cityName',
      },
      {
        title: '详细地址',
        dataIndex: 'address',
        ellipsis: true,
      },
      {
        label: '所属商圈',
        name: 'businessHub',
      },
      {
        title: '经营类目',
        align: 'center',
        dataIndex: 'topCategoryName',
        render: (val, row) => `${val} / ${row.categoryName}`,
      },
      {
        title: '申请时间',
        align: 'center',
        dataIndex: 'submitTime',
      },
      {
        title: '审核人',
        align: 'center',
        dataIndex: 'verifierName',
      },
      {
        title: '审核时间',
        align: 'center',
        dataIndex: 'verifyTime',
      },
      {
        title: '审核结果',
        align: 'center',
        dataIndex: 'verifyStatus',
        render: (val) => BUSINESS_DETAIL_AUDIT[val],
      },
      {
        title: '驳回原因',
        align: 'center',
        dataIndex: 'rejectReason',
        ellipsis: true,
      },
    ],
  };

  const tableProps = {
    noCard: false,
    loading,
    columns: propItem.getColumns,
    searchItems: propItem.searchItems,
    dispatchType: propItem.dispatchType,
    size: 'middle',
    ...businessAudit.detailList,
  };

  return (
    <Modal
      title={'审核记录'}
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible(false)}
    >
      <TableDataBlock {...tableProps} rowKey={(row) => `${row[propItem.rowKey]}`} />
    </Modal>
  );
};

export default connect(({ businessAudit, loading }) => ({
  businessAudit,
  loading: loading.effects['businessAudit/fetchGetDetailList'],
}))(BusinessAuditDetailList);
