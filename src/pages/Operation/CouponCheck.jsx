import React, { useState } from 'react';
import { connect } from 'umi'
import { Card, Tag } from 'antd';
import {
    BUSINESS_TYPE,
    SPECIAL_STATUS,
    GOODS_CLASS_TYPE,
    SPECIAL_RECOMMEND_DELSTATUS,
    BUSINESS_STATUS_AUDIT
} from '@/common/constant';

import Ellipsis from '@/components/Ellipsis';
import NoCheck from './components/CouponCheck/NoCheck'
import NoConfirm from './components/CouponCheck/NoConfirm'
import AlCheck from './components/CouponCheck/AlCheck'
import AlConfirm from './components/CouponCheck/AlConfirm'

const tabList = [
    {
        key: '0',
        tab: '待审核',
    },
    {
        key: '1',
        tab: '待确认',
    },
    {
        key: '2',
        tab: '已审核',
    },
    {
        key: '3',
        tab: '已确认',
    },
]

const CouponCheck = (props) => {
    const { dispatch, loading, hubData } = props
    const [tabkey, setTabKey] = useState('0');

    // 获取商圈
    const fetchGetHubSelect = (districtCode) => {
        dispatch({
            type: 'baseData/fetchGetHubData',
            payload: {
                districtCode,
            },
        });
    };

    //组建公用的搜索条件
    const globalSearch = [
        {
            label: '商品名称',
            name: 'goodsName',
        },
        {
            label: '集团/店铺名',
            name: 'groupOrMerchantName',
        },
        // {
        //     label: '活动状态',
        //     name: 'status',
        //     type: 'select',
        //     select: SPECIAL_STATUS,
        // },
        {
            label: '创建人',
            name: 'creatorName',
        },
        {
            label: '创建时间',
            type: 'rangePicker',
            name: 'beginDate',
            end: 'endDate',
        },
        // {
        //     label: '活动有效期',
        //     type: 'rangePicker',
        //     name: 'activityStartTime',
        //     end: 'activityEndTime',
        // },
        // {
        //     label: '地区',
        //     name: 'city',
        //     type: 'cascader',
        //     changeOnSelect: true,
        //     valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
        //     onChange: (val) => val.length === 3 && fetchGetHubSelect(val[2]),
        // },
        // {
        //     label: '商圈',
        //     name: 'businessHubId',
        //     type: 'select',
        //     // loading: loading,
        //     allItem: false,
        //     select: hubData,
        //     fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
        // },
        {
            label: '店铺类型',
            name: 'ownerType',
            type: 'select',
            select: BUSINESS_TYPE,
        },
        {
            label: '审核类型',
            name: 'checkType',
            type: 'select',
            select: BUSINESS_STATUS_AUDIT,
        },
        {
            label: '券类型',
            name: 'ownerType',
            type: 'select',
            select: BUSINESS_TYPE,
        },
    ];

    //tab自组件Table公用的colum数据部分
    const globalColum = [
        {
            title: '券/店铺名称',
            fixed: 'left',
            dataIndex: 'goodsImg',
            render: (val, row) => (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        flex: 1,
                        marginLeft: 5,
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        <Tag color={row.goodsType === 'single' ? 'orange' : 'magenta'}>
                            {GOODS_CLASS_TYPE[row.goodsType]}
                        </Tag>
                        <Ellipsis length={10} tooltip>
                            {row.goodsName}
                        </Ellipsis>
                    </div>
                    <div style={{ display: 'flex', marginTop: 5 }}>
                        <Tag>{BUSINESS_TYPE[row.ownerType]}</Tag>
                        <Ellipsis length={10} tooltip>
                            {row.merchantName}
                        </Ellipsis>
                    </div>
                </div>
            ),
        },
        // {
        //     title: '佣金',
        //     align: 'right',
        //     dataIndex: 'realPrice',
        //     render: (val, row) => `￥${(Number(row.realPrice) - Number(row.merchantPrice)).toFixed(2)}`,
        //     sorter: (a, b) =>
        //         Number(a.realPrice) -
        //         Number(a.merchantPrice) -
        //         (Number(b.realPrice) - Number(b.merchantPrice)),
        // },
        {
            title: '券价值/售价',
            align: 'right',
            dataIndex: 'oriPrice',
            render: (val, row) => {
                const zhe = (Number(row.realPrice) / Number(val)) * 10;
                return (
                    <div>
                        <div style={{ textDecoration: 'line-through', color: '#999999' }}>
                            ￥{Number(val).toFixed(2)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Tag color={'red'}>
                                {zhe < 0.1 || (zhe > 0.1 && zhe < 1) ? zhe.toFixed(2) : zhe.toFixed(0)}折
                    </Tag>
                            <div>￥{Number(row.realPrice).toFixed(2)}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: '使用门槛',
            align: 'center',
            dataIndex: 'useThreshold',
            render: (val, row) => {
                const { useThreshold } = row;
                switch (useThreshold) {
                    case "threshold":
                        return "有门槛"
                    default:
                        return "无门槛"
                }
            },
        },
        {
            title: '使用有效期',
            dataIndex: 'useStartTime',
            render: (val, row) => {
                const { useStartTime, useEndTime, useTimeRule, delayDays, activeDays } = row;
                if (!useTimeRule) return '';
                if (useTimeRule === 'fixed') {
                    return useStartTime + '~' + useEndTime;
                } else {
                    if (delayDays === '0') {
                        return `领取后立即生效\n有效期${activeDays}天`;
                    }
                    return `领取后${delayDays}天生效\n有效期${activeDays}天`;
                }
            },
        },
        {
            title: '审核创建时间',
            align: 'center',
            dataIndex: 'activityStartTime',
        },
        {
            title: '成本价',
            align: 'center',
            dataIndex: 'otherPlatformPrice',
        },
        {
            title: '活动时间',
            align: 'center',
            dataIndex: 'activityStartTime',
            render: (val, row) => (
                <>
                    {row.activityTimeRule === 'infinite'
                        ? `${row.createTime} ~ 长期`
                        : `${val} ~ ${row.activityEndTime}`}
                    <div>
                        {row.deleteFlag === '0'
                            ? SPECIAL_RECOMMEND_DELSTATUS[row.deleteFlag]
                            : SPECIAL_STATUS[row.status]}
                    </div>
                </>
            ),
        },
        {
            title: '剩余数量',
            align: 'center',
            dataIndex: 'number',
        },
        {
            title: '审核类型',
            align: 'center',
            dataIndex: 'checkType',
        },
    ]

    const result = [

    ]

    const noCheckcolumOperation = [
        {
            title: '操作',
            align: 'center',
            dataIndex: 'operation',
            render: () => {
                return <a>审核</a>
            }
        },
    ]

    const checkResult = [
        {
            title: '审核结果',
            align: 'center',
            dataIndex: 'checkResult',
            render: (val, row) => {
                return <a>审核成功</a>
            }
        },
        {
            title: '驳回原因',
            align: 'center',
            dataIndex: 'rejectionReasons',
            render: (val, row) => {
                return <Ellipsis length={12} tooltip>
                {row.merchantName}
            </Ellipsis>
            }
        },
    ]

    const columOperation = [
        {
            title: '操作',
            align: 'center',
            dataIndex: 'operation',
            render: () => {
                return <a>详情</a>
            }
        },
    ]

    const noCheckColum = globalColum.concat(noCheckcolumOperation)

    const listProps = { tabkey, colum: noCheckColum, globalSearch };

    const noConfirmColum = globalColum.concat(columOperation)

    const listPropsNoConfirm = { tabkey, colum: noConfirmColum, globalSearch };

    const confirmColum = globalColum.concat(checkResult).concat(columOperation)

    const propsCheckDone = { tabkey, colum: confirmColum, globalSearch }

    const contentList = {
        0: <NoCheck {...listProps}></NoCheck>,
        1: <NoConfirm {...listPropsNoConfirm}></NoConfirm>,
        2: <AlCheck {...propsCheckDone}></AlCheck>,
        3: <AlConfirm {...propsCheckDone}></AlConfirm>,
    };

    return (
        <Card
            tabList={tabList}
            activeTabKey={tabkey}
            onTabChange={(key) => setTabKey(key)}
        >
            {contentList[tabkey]}
        </Card>
    )

}
export default connect(({ baseData, loading }) => ({
    // specialGoods,
    hubData: baseData.hubData,
    loading: loading.models.baseData
}))(CouponCheck);