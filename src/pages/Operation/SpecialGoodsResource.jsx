import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Card, Tag, Button } from 'antd';
import {
  BUSINESS_TYPE,
  SPECIAL_STATUS,
  GOODS_CLASS_TYPE,
  SPECIAL_USERTIME_TYPE,
  SPECIAL_RECOMMEND_TYPE,
  SPECIAL_RECOMMEND_DELSTATUS,
} from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HotGoods from './components/SpecialResource/HotGoods';
import AroundSpecialGoods from './components/SpecialResource/AroundSpecialGoods';
import DayPushGoods from './components/SpecialResource/DayPushGoods';
import NextPeriodGoods from './components/SpecialResource/NextPeriodGoods';
import NoviceGoods from './components/SpecialResource/NoviceGoods';
import ThisPeriodGoods from './components/SpecialResource/ThisPeriodGoods';
import TodayGoods from './components/SpecialResource/TodayGoods';

const tabList = [
  {
    key: 'hot',
    tab: '限时抢购',
  },
  {
    key: 'today',
    tab: '爆品福利',
  },
  {
    key: 'thisPeriod',
    tab: '本期必抢',
  },
  {
    key: 'nextPeriod',
    tab: '下期预告',
  },
  {
    key: 'novice',
    tab: '新手视频',
  },
  {
    key: 'dayPush',
    tab: '每日必推',
  },
  {
    key: 'aroundSpecial',
    tab: '特惠推荐',
  },
];

const SpecialGoodsResource = (props) => {
  const { loadings, hubData, dispatch, specialGoods } = props;
  const tableRef = useRef();
  const [searchType, setSearchType] = useState(null); // 搜索类型
  const [tabkey, setTabKey] = useState('hot');

  const { chooseList = [] } = specialGoods;
  console.log(chooseList, 'vvvvv');

  const { cancel, ...other } = SPECIAL_RECOMMEND_TYPE;
  const search_recommend = { notPromoted: '未推广', ...other };

  // 获取商圈
  const fetchGetHubSelect = (districtCode) => {
    dispatch({
      type: 'baseData/fetchGetHubData',
      payload: {
        districtCode,
      },
    });
  };

  // 搜索参数
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
      label: '活动状态',
      name: 'status',
      type: 'select',
      select: SPECIAL_STATUS,
    },
    {
      label: '活动有效期',
      type: 'rangePicker',
      name: 'activityStartTime',
      end: 'activityEndTime',
    },
    {
      label: '使用有效期',
      type: 'select',
      name: 'useTimeRule',
      allItem: false,
      select: SPECIAL_USERTIME_TYPE,
      handle: (form) => ({
        onChange: (val) => {
          console.log(val);
          setSearchType(val);
          form.setFieldsValue({ gain: undefined });
        },
      }),
    },
    {
      label: '有效期',
      name: { gain: 'activeDays', fixed: 'useStartTime' }[searchType],
      disabled: !searchType,
      type: { gain: 'number', fixed: 'rangePicker' }[searchType],
      end: 'useEndTime',
    },
    {
      label: '佣金',
      name: 'commission',
      type: 'numberGroup',
    },
    {
      label: '推广位置',
      type: 'select',
      name: 'promotionLocation',
      select: search_recommend,
    },
    {
      label: '区域',
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
      loading: loadings.models.baseData,
      allItem: false,
      select: hubData,
      fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
    },
    {
      label: '店铺类型',
      name: 'ownerType',
      type: 'select',
      select: BUSINESS_TYPE,
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'createStartTime',
      end: 'createEndTime',
    },
    {
      label: '创建人',
      name: 'creatorName',
    },
  ];

  // table 表头
  const globalColum = [
    {
      title: '商品名称/店铺',
      fixed: 'left',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <PopImgShow url={val} />
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
        </div>
      ),
    },
    {
      title: '所在地区',
    },
    {
      title: '佣金',
      align: 'right',
      dataIndex: 'realPrice',
      render: (val, row) => `￥${(Number(row.realPrice) - Number(row.merchantPrice)).toFixed(2)}`,
      sorter: (a, b) =>
        Number(a.realPrice) -
        Number(a.merchantPrice) -
        (Number(b.realPrice) - Number(b.merchantPrice)),
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
      title: '其它平台价格',
      align: 'right',
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
      align: 'right',
      dataIndex: 'remain',
      sorter: (a, b) => a.remain - b.remain,
    },
    {
      title: '销量',
      align: 'right',
      dataIndex: 'soldGoodsCount',
      sorter: (a, b) => a.soldGoodsCount - b.soldGoodsCount,
    },
    {
      title: '核销数量',
      align: 'right',
      dataIndex: 'writeOffGoodsCount',
      sorter: (a, b) => a.writeOffGoodsCount - b.writeOffGoodsCount,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.creatorName || ''}`,
    },
  ];

  const rowHandle = [
    {
      // type: 'info',
      title: '取消推荐',
    },
    {
      // type: 'info',
      title: '置顶',
    },
  ];
  const handleCancle = () => {
    if (chooseList) {
      const payload = {
        specialGoodsId: chooseList ? chooseList.toString() : '',
        recommendType: tabkey,
      };
      console.log(payload, 'dddddddddddd');
      // dispatch({
      //   type: 'specialGoods/fetchSpecialCancleRecommend',
      //   payload:payload,
      //   callback: () => {
      //     tableRef.current.fetchGetData();
      //   },
      // });
    }
  };
  const listProps = { tableRef, tabkey, globalColum, globalSearch };

  const contentList = {
    hot: <HotGoods {...listProps}></HotGoods>,
    today: <TodayGoods {...listProps}></TodayGoods>,
    thisPeriod: <ThisPeriodGoods {...listProps}></ThisPeriodGoods>,
    nextPeriod: <NextPeriodGoods {...listProps}></NextPeriodGoods>,
    novice: <NoviceGoods {...listProps}></NoviceGoods>,
    dayPush: <DayPushGoods {...listProps}></DayPushGoods>,
    aroundSpecial: <AroundSpecialGoods {...listProps}></AroundSpecialGoods>,
  };

  // 推荐状态 / 置顶状态
  const fetchSpecialGoodsRecommend = (payload) => {
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsRecommend',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  return (
    <>
      <Card
        tabList={tabList}
        activeTabKey={tabkey}
        onTabChange={(key) => {
          setTabKey(key);
          dispatch({
            type: 'specialGoods/cancleRecommend',
            payload: {
              chooseList: [],
              tabkey: tabkey,
            },
          });
        }}
        extra={<Button onClick={handleCancle}>取消推荐</Button>}
      >
        {contentList[tabkey]}
      </Card>
    </>
  );
};

export default connect(({ baseData, loading, specialGoods }) => ({
  specialGoods,
  hubData: baseData.hubData,
  loading: loading.effects['baseData/fetchGetLogDetail'],
  loadings: loading,
}))(SpecialGoodsResource);
