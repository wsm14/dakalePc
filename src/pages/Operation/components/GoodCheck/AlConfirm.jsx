import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import {
    BUSINESS_TYPE,
    SPECIAL_STATUS,
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const AlConfirm = (props) => {
    const { tabkey, globalColum = [], globalSearch,loading, specialGoods } = props 
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

export default connect(({ specialGoods, loading }) => ({
    specialGoods,
    loading: loading.models.specialGoods || loading.effects['baseData/fetchGetLogDetail'],
}))(AlConfirm);