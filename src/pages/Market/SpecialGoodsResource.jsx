import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import {
  BUSINESS_TYPE,
  SPECIAL_STATUS,
  GOODS_CLASS_TYPE,
  SPECIAL_USERTIME_TYPE,
  SPECIAL_RECOMMEND_TYPE,
  SPECIAL_RECOMMEND_DELSTATUS,
} from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import Ellipsis from '@/components/Ellipsis';
import QuestionTooltip from '@/components/QuestionTooltip';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import ExtraButton from '@/components/ExtraButton';
import GoodResourceSet from './components/SpecialGoodsResource/GoodResourceSet';
import WeightSet from './components/SpecialGoodsResource/WeightSet';

const SpecialGoodsResource = (props) => {
  const { loadings, loading, hubData, dispatch, specialGoodsResource } = props;
  const tableRef = useRef();
  const [searchType, setSearchType] = useState(null); // 搜索类型
  const [goodsList, setGoodsList] = useState([]); // 选择取消推荐的商品
  const [tabKey, setTabKey] = useState('hot');

  const [visibleSet, setVisibleSet] = useState(false);

  // tab 标签
  const search_recommend = {
    ...SPECIAL_RECOMMEND_TYPE,
    highCommission: '高佣联盟',
    todayNew: '今日上新',
    selfTour: '自我游',
    newProductRecommend: '新品推荐',
  };

  useEffect(() => {
    setGoodsList([]);
    tableRef.current.fetchGetData({ promotionLocation: tabKey });
  }, [tabKey]);

  // 获取商圈
  const fetchGetHubSelect = (districtCode) => {
    dispatch({
      type: 'baseData/fetchGetHubData',
      payload: {
        districtCode,
      },
    });
  };

  //取消推荐
  const handleCancle = (val) => {
    if (goodsList || val) {
      const goodsLists = goodsList ? goodsList.toString() : '';
      const payload = {
        specialGoodsId: goodsLists || val,
        recommendType: tabKey,
      };
      dispatch({
        type: 'specialGoodsResource/fetchSpecialCancleRecommend',
        payload: payload,
        callback: () => {
          tableRef.current.fetchGetData();
        },
      });
    } else {
    }
  };
  //调教配置回显
  const getConfigDetail = () => {
    if (['highCommission', 'todayNew'].includes(tabKey)) {
      dispatch({
        type: 'specialGoodsResource/fetchResourceDicts',
        payload: {
          parent: 'specialGoods',
          child: tabKey,
        },
        callback: (detail) => {
          setVisibleSet({ show: true, tabKey, detail });
        },
      });
    }
  };

  //置顶
  const handletoTop = (val) => {
    const payload = {
      specialGoodsId: val,
      recommendType: tabKey,
    };
    dispatch({
      type: 'specialGoodsResource/fetchSpecialToTop',
      payload: payload,
      callback: () => {
        tableRef.current.fetchGetData();
      },
    });
  };

  //取下置顶
  const handleCancletoTop = (val) => {
    const payload = {
      specialGoodsId: val,
      recommendType: tabKey,
    };
    dispatch({
      type: 'specialGoodsResource/fetchSpecialCancleToTop',
      payload: payload,
      callback: () => {
        tableRef.current.fetchGetData();
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
      name: 'ownerId',
      type: 'merchant',
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
      disabledDate: () => false,
      type: { gain: 'number', fixed: 'rangePicker' }[searchType],
      end: 'useEndTime',
    },
    {
      label: '佣金',
      name: 'commission',
      type: 'numberGroup',
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
                {row.ownerName}
              </Ellipsis>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '所在地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val),
    },
    {
      title: '佣金',
      align: 'right',
      dataIndex: 'commission',
      render: (val, row) => `￥${val}`,
      sorter: (a, b) => Number(a.commission) - Number(b.commission),
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
              <Tag color={'red'}>{`${zhe}`.substring(0, 4)}折</Tag>
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
      // render: (val, row) => `${val}\n${SUBMIT_TYPE[row.creatorType]}--${row.creatorName || ''}`,
    },
    {
      title: <QuestionTooltip type="quest" title="权重" content="数值越大越靠前"></QuestionTooltip>,
      align: 'center',
      fixed: 'right',
      dataIndex: 'weight',
      show: !['highCommission', 'todayNew'].includes(tabKey),
      render: (val, row) => (
        <WeightSet
          detail={row}
          childRef={tableRef}
          params={{
            specialGoodsId: row.specialGoodsId,
            ownerIdString: row.ownerIdString,
            recommendType: tabKey,
          }}
        ></WeightSet>
      ),
    },
    {
      title: '状态',
      fixed: 'right',
      align: 'right',
      dataIndex: 'status',
      render: (val) => SPECIAL_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'specialGoodsId',
      show: !['highCommission', 'todayNew'].includes(tabKey), // 高佣联盟 和 今日上新 不显示
      width: 180,
      render: (val, record) => {
        return [
          {
            type: 'cancleRecommend',
            title: '取消推荐', // 高佣联盟 和 今日上新 不显示
            visible: !['highCommission', 'todayNew'].includes(tabKey),
            click: () => handleCancle(val),
          },
          // {
          //   type: 'placement',
          //   title: '置顶', // 限时抢购，爆品福利，每日必推，特惠推荐显示 且
          //   visible:
          //     ['hot', 'today', 'dayPush', 'aroundSpecial'].includes(tabKey) &&
          //     record.isRecommendTop == '0',
          //   click: () => handletoTop(val),
          // },
          // {
          //   type: 'placement',
          //   title: '取消置顶', // 限时抢购，爆品福利，每日必推，‘特惠推荐显示
          //   visible:
          //     ['hot', 'today', 'dayPush', 'aroundSpecial'].includes(tabKey) &&
          //     record.isRecommendTop == '1',
          //   click: () => handleCancletoTop(val),
          // },
        ];
      },
    },
  ];

  const btnList = [
    {
      auth: 'cancleRecommend',
      text: '取消推荐',
      disabled: !goodsList.length,
      onClick: handleCancle,
    },
    {
      auth: 'configCondit',
      text: '条件配置', // 高佣联盟 和 今日上新 存在条件配置
      show: ['highCommission', 'todayNew'].includes(tabKey),
      onClick: getConfigDetail,
    },
  ];

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: Object.keys(search_recommend)
            .filter((i) => i !== 'null')
            .map((key) => ({ key, tab: search_recommend[key] })),
          activeTabKey: tabKey,
          onTabChange: setTabKey,
          tabBarExtraContent: <ExtraButton list={btnList}></ExtraButton>,
        }}
        cRef={tableRef}
        loading={loading}
        columns={globalColum}
        searchItems={globalSearch}
        rowKey={(record) => `${record.specialGoodsId}`}
        dispatchType="specialGoodsResource/fetchGetList"
        params={{ promotionLocation: tabKey }}
        rowSelection={{
          getCheckboxProps: ({ status, deleteFlag }) => ({
            disabled: !['1', '2'].includes(status) || deleteFlag == '0', // 不是 活动中 即将开始 || 已删除
          }),
          selectedRowKeys: goodsList,
          onChange: setGoodsList,
        }}
        {...specialGoodsResource}
      ></TableDataBlock>
      {/* 条件配置 */}
      <GoodResourceSet
        visible={visibleSet}
        cRef={tableRef}
        onClose={() => setVisibleSet(false)}
      ></GoodResourceSet>
    </>
  );
};

export default connect(({ baseData, loading, specialGoodsResource }) => ({
  specialGoodsResource,
  hubData: baseData.hubData,
  loadings: loading,
  loading: loading.models.specialGoodsResource || loading.effects['baseData/fetchGetLogDetail'],
}))(SpecialGoodsResource);
