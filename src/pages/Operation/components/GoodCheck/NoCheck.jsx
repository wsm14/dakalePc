import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import {
    BUSINESS_TYPE,
    SPECIAL_STATUS,
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

// 待审核
const NoCheck = (props) => {
    const { tabkey, globalColum = [], globalSearch,loading, specialGoods} = props 
    const childRef = useRef();

    const searchItems = [
      ...globalSearch
    ];

    const getColumns = [
        ...globalColum,
        {
            type: 'handle',
            dataIndex: 'id',
            render: (val, record) => {
              const { merchantIdStr } = record;
              return [
                {
                  type: 'check',
                  title:"审核"
                },
              ];
            }
        }
    ];

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
}))(NoCheck);