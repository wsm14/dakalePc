import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import {
    BUSINESS_TYPE,
    SPECIAL_STATUS,
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
// 待确认

const NoConfirm = (props) => {
    const { tabkey, globalColum = [], globalSearch,loading, specialGoodsCheck, hubData,rowHandle } = props 
    const childRef = useRef();

    const searchItems = [
      ...globalSearch
    ];

    const getColumns = [
        ...globalColum,
       ...rowHandle,
    ]

    return (
        <TableDataBlock
            cRef={childRef}
            loading={loading}
            columns={getColumns}
            searchItems={searchItems}
            rowKey={(record) => `${record.auditIdString}`}
            dispatchType="specialGoodsCheck/fetchGetList"
            params={{auditSearchType:tabkey}}
            {...specialGoodsCheck}
        ></TableDataBlock>
    )
}

export default connect(({ specialGoodsCheck, baseData, loading }) => ({
    specialGoodsCheck,
    hubData: baseData.hubData,
    loading: loading.models.specialGoodsCheck || loading.effects['baseData/fetchGetLogDetail'],
}))(NoConfirm);