import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import {
    BUSINESS_TYPE,
    SPECIAL_STATUS,
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const NoConfirm = (props) => {
    const { tabkey, globalColum = [], globalSearch,loading, specialGoods, hubData } = props 
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
            rowKey={(record) => `${record.specialGoodsId}`}
            dispatchType="specialGoods/fetchGetList"
            {...specialGoods}
        ></TableDataBlock>

    )
}

export default connect(({ specialGoods, baseData, loading }) => ({
    specialGoods,
    hubData: baseData.hubData,
    loading: loading.models.specialGoods || loading.effects['baseData/fetchGetLogDetail'],
}))(NoConfirm);