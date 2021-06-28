import React, { useState } from 'react';
import { connect } from 'umi';
import { Card, Tag } from 'antd';
import {
  BUSINESS_TYPE,
  CHECK_TYPE,
  SPECIAL_STATUS,
  GOODS_CLASS_TYPE,
  SPECIAL_RECOMMEND_DELSTATUS,
} from '@/common/constant';

import Ellipsis from '@/components/Ellipsis';
import NoCheck from './components/GoodCheck/NoCheck';
import NoConfirm from './components/GoodCheck/NoConfirm';
import AlCheck from './components/GoodCheck/AlCheck';
import AlConfirm from './components/GoodCheck/AlConfirm';

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
];

const SpecialGoodCheck = (props) => {
  const { dispatch, loading, hubData } = props;
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
    {
      label: '创建人',
      name: 'creatorName',
    },
    {
      label: '活动有效期',
      type: 'rangePicker',
      name: 'activityStartTime',
      end: 'activityEndTime',
    },
    // {
    //     label: '活动状态',
    //     name: 'status',
    //     type: 'select',
    //     select: SPECIAL_STATUS,
    // },

    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      onChange: (val) => val.length === 3 && fetchGetHubSelect(val[2]),
    },
    {
      label: '商圈',
      name: 'businessHubId',
      type: 'select',
      // loading: loading,
      allItem: false,
      select: hubData,
      fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'createStartTime',
      end: 'createEndTime',
    },
    {
      label: '店铺类型',
      name: 'ownerType',
      type: 'select',
      select: BUSINESS_TYPE,
    },

    {
      label: '审核类型',
      name: 'ownerType',
      type: 'select',
      select: CHECK_TYPE,
    },
  ];

  //tab自组件Table公用的colum数据部分
  const globalColum = [
    {
      title: '商品/店铺名称',
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
    {
      title: '佣金',
      align: 'right',
      dataIndex: 'realPrice',
      render: (val, row) => `￥${(Number(row.realPrice) - Number(row.merchantPrice)).toFixed(2)}`,
    },
    {
      title: '原价/售价',
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
      title: '成本价',
      align: 'center',
      dataIndex: 'otherPlatformPrice',
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
      title: '投放数量',
      align: 'center',
      dataIndex: 'activityStartTime',
    },
    {
      title: '审核类型',
      align: 'center',
      dataIndex: 'activityStartTime',
    },
  ];
  const listProps = { tabkey, globalColum, globalSearch };

  const contentList = {
    0: <NoCheck {...listProps}></NoCheck>,
    1: <NoConfirm {...listProps}></NoConfirm>,
    2: <AlCheck {...listProps}></AlCheck>,
    3: <AlConfirm {...listProps}></AlConfirm>,
  };

  return (
    <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
      {contentList[tabkey]}
    </Card>
  );
};
export default connect(({ baseData, loading }) => ({
  // specialGoods,
  hubData: baseData.hubData,
  loading: loading.models.baseData,
}))(SpecialGoodCheck);
