import React, { useState } from 'react';
import { connect } from 'umi';
import {
    GOODS_CHECK_RESSTATUS
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const AlConfirm = (props) => {
    const {tableRef, tabkey, globalColum = [], globalSearch, loading, couponAudit, rowHandle } = props;

    const searchItems = [
      ...globalSearch,
      {
        label: '审核结果',
        name: 'auditStatus',
        type: 'select',
        select: GOODS_CHECK_RESSTATUS,
      },
    ];

    const getColumns = [
        ...globalColum,
        {
            title: '审核时间',
            dataIndex: 'auditTime',
          },
          {
            title: '审核结果',
            dataIndex: 'auditStatus',
            render:(val)=>GOODS_CHECK_RESSTATUS[val]
          },
          {
            title: '驳回原因',
            dataIndex: 'rejectReason',
          },
          ...rowHandle,
    ]

    return (
        <TableDataBlock
            cRef={tableRef}
            loading={loading}
            columns={getColumns}
            searchItems={searchItems}
            params={{ auditSearchType: tabkey }}
            rowKey={(record) => `${record.auditIdString}`}
            dispatchType="couponAudit/fetchGetList"
            {...couponAudit}
        ></TableDataBlock>

    )
}

export default connect(({ couponAudit, loading }) => ({
    couponAudit,
    loading: loading.models.couponAudit || loading.effects['baseData/fetchGetLogDetail'],
}))(AlConfirm);