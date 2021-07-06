import React, { useRef, useState } from 'react';
import { connect } from 'umi';

import TableDataBlock from '@/components/TableDataBlock';

const AlCheck = (props) => {
    const { tabkey, globalColum = [], globalSearch,loading, couponAudit} = props 
    const childRef = useRef();

    const searchItems = [
      ...globalSearch
    ];

    const getColumns = [
        ...globalColum,
    ]

    return (
        <TableDataBlock
            cRef={childRef}
            loading={loading}
            columns={getColumns}
            searchItems={searchItems}
            rowKey={(record) => `${record.auditIdString}`}
            dispatchType="couponAudit/fetchGetList"
            {...couponAudit}
        ></TableDataBlock>

    )
}

export default connect(({ couponAudit, baseData, loading }) => ({
    couponAudit,
    loading: loading.models.couponAudit || loading.effects['baseData/fetchGetLogDetail'],
}))(AlCheck);