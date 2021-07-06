import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import {
    BUSINESS_TYPE,
    SPECIAL_STATUS,
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const NoCheck = (props) => {
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

export default connect(({ couponAudit, loading }) => ({
    couponAudit,
    loading: loading.models.couponAudit || loading.effects['baseData/fetchGetLogDetail'],
}))(NoCheck);