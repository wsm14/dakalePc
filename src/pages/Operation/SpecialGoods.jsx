import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Tag } from 'antd';
import {
  BUSINESS_TYPE,
  SPECIAL_STATUS,
  GOODS_CLASS_TYPE,
  SPECIAL_USERTIME_TYPE,
  SPECIAL_RECOMMEND_TYPE,
  SPECIAL_RECOMMEND_DELSTATUS,
  SUBMIT_TYPE,
} from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import ExtraButton from '@/components/ExtraButton';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import SpecialRecommendMenu from './components/SpecialGoods/SpecialRecommendMenu';
import PreferentialDrawer from './components/SpecialGoods/PreferentialDrawer';
import SpecialGoodDetail from './components/SpecialGoods/SpecialGoodDetail';
import QrCodeShow from './components/SpecialGoods/Detail/QrCodeShow';
import excelProps from './components/SpecialGoods/ExcelProps';
import RemainModal from './components/SpecialGoods/Detail/RemainModal';
import AuthConsumer from '@/layouts/AuthConsumer';
import ShareImg from './components/SpecialGoods/ShareImg';
import { checkCityName } from '@/utils/utils';

// tab栏列表
const tabList = [
  {
    key: '0',
    tab: '特惠商品',
  },
  {
    key: '1',
    tab: '自我游',
  },
];

const SpecialGoods = (props) => {
  const { specialGoods, loading, loadings, hubData, dispatch } = props;
  const { list } = specialGoods;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('0'); // tab
  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [searchType, setSearchType] = useState(null); // 搜索类型
  const [goodsList, setGoodsList] = useState([]); // 选择推荐的商品
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 审核拒绝 下架原因
  const [qrcode, setQrcode] = useState({ url: null, title: '' }); // 商品码
  const [visibleRemain, setVisibleRemain] = useState(false);
  const [visibleShare, setVisibleShare] = useState(false);

  const search_recommend = { notPromoted: '未推广', ...SPECIAL_RECOMMEND_TYPE };

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ deleteFlag: '1', selfTourFlag: tabKey });
  }, [tabKey]);

  useEffect(() => {
    if (childRef.current) {
      childRef.current.fetchGetData();
    }
  }, []);

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
  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    // {
    //   label: '集团/店铺名',
    //   name: 'ownerId',
    //   type: 'merchant',
    // },
    {
      label: '活动状态',
      name: 'status',
      type: 'select',
      select: SPECIAL_STATUS,
    },
    // {
    //   label: '商品状态',
    //   name: 'deleteFlag',
    //   type: 'select',
    //   allItem: false,
    //   select: ['已删除', '未删除'],
    // },
    {
      label: '活动有效期',
      type: 'rangePicker',
      name: 'activityStartDate',
      end: 'activityEndDate',
      disabledDate: () => false,
    },
    // {
    //   label: '使用有效期',
    //   type: 'select',
    //   name: 'useTimeRule',
    //   allItem: false,
    //   select: SPECIAL_USERTIME_TYPE,
    //   handle: (form) => ({
    //     onChange: (val) => {
    //       setSearchType(val);
    //       form.setFieldsValue({ gain: undefined });
    //     },
    //   }),
    // },
    // {
    //   label: '有效期',
    //   name: { gain: 'activeDays', fixed: 'startDate' }[searchType],
    //   disabled: !searchType,
    //   disabledDate: () => false,
    //   type: { gain: 'number', fixed: 'rangePicker' }[searchType],
    //   end: 'endDate',
    // },
    // {
    //   label: '佣金',
    //   name: 'commission',
    //   type: 'numberGroup',
    // },
    // {
    //   label: '推广位置',
    //   type: 'select',
    //   show: tabKey === '0',
    //   name: 'promotionLocation',
    //   select: search_recommend,
    // },
    // {
    //   label: '区域',
    //   name: 'city',
    //   type: 'cascader',
    //   changeOnSelect: true,
    //   valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    //   onChange: (val) => val.length === 3 && fetchGetHubSelect(val[2]),
    // },
    // {
    //   label: '商圈',
    //   name: 'businessHubId',
    //   type: 'select',
    //   loading: loadings.models.baseData,
    //   allItem: false,
    //   select: hubData,
    //   fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
    // },
    // {
    //   label: '店铺类型',
    //   name: 'ownerType',
    //   type: 'select',
    //   select: BUSINESS_TYPE,
    // },
    // {
    //   label: '创建时间',
    //   type: 'rangePicker',
    //   name: 'createStartTime',
    //   end: 'createEndTime',
    // },
    // {
    //   label: '创建人',
    //   name: 'creatorName',
    // },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品主图',
      dataIndex: 'goodsImg',
      render: (val, row) => <PopImgShow url={val} />,
    },
    {
      title: '商品名称/ID',
      dataIndex: 'goodsName',
      align: 'center',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
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
              <Tag color={row.productType === 'single' ? 'orange' : 'magenta'}>
                {GOODS_CLASS_TYPE[row.productType]}
              </Tag>
              <Ellipsis length={10} tooltip>
                {val}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex', marginTop: 5 }}>
              <Ellipsis length={10} tooltip>
                {row.goodsId}
              </Ellipsis>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '所属店铺/地区',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
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
              <Tag>{BUSINESS_TYPE[row.relateType]}</Tag>
              <Ellipsis length={10} tooltip>
                {row.relateName}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex', marginTop: 5 }}>
              <Ellipsis length={10} tooltip>
                {row.ownerName}
              </Ellipsis>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '原价/售价',
      align: 'right',
      dataIndex: 'oriPrice',
      render: (val, row) => {
        const zhe = (Number(row.sellPrice) / Number(val)) * 10;
        return (
          <div>
            <div style={{ textDecoration: 'line-through', color: '#999999' }}>
              ￥{Number(val).toFixed(2)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tag color={'red'}>{`${zhe}`.substring(0, 4)}折</Tag>
              <div>￥{Number(row.sellPrice).toFixed(2)}</div>
            </div>
          </div>
        );
      },
    },
    // {
    //   title: '佣金',
    //   align: 'right',
    //   dataIndex: 'sellPrice',
    //   render: (val, row) => `￥${val}`,
    //   sorter: (a, b) => Number(a.commission) - Number(b.commission),
    // },
    // {
    //   title: '其它平台价格',
    //   align: 'right',
    //   dataIndex: 'otherPlatformPrice',
    // },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'activityStartDate',
      render: (val, row) => (
        <>
          {row.activityTimeRule === 'infinite'
            ? `${row.createTime} ~ 长期`
            : `${val} ~ ${row.activityEndDate}`}
          <div>
            {row.deleteFlag === '0'
              ? SPECIAL_RECOMMEND_DELSTATUS[row.deleteFlag]
              : SPECIAL_STATUS[row.status]}
          </div>
        </>
      ),
    },
    {
      title: '使用有效期',
      dataIndex: 'useTimeRuleObject',
      render: (val, row) => {
        const { startDate, endDate, type, delayDays, activeDays } = val;
        if (!type) return '';
        if (type === 'fixed') {
          return startDate + '~' + endDate;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },

    {
      title: '剩余库存',
      align: 'right',
      dataIndex: 'remain',
      sorter: (a, b) => a.remain - b.remain,
    },
    {
      title: '最后更新时间',
      align: 'right',
      dataIndex: 'updataTime',
      render: (val, row) => `${moment(val).format('YYYY-MM-DD HH:mm')}\n${row.updater || ''}`,
    },
    {
      title: '商品状态',
      align: 'right',
      dataIndex: 'status',
      render: (val) => SPECIAL_STATUS[val],
    },
    // {
    //   title: '销量',
    //   align: 'right',
    //   dataIndex: 'soldGoodsCount',
    //   sorter: (a, b) => a.soldGoodsCount - b.soldGoodsCount,
    // },
    // {
    //   title: '核销数量',
    //   align: 'right',
    //   dataIndex: 'writeOffGoodsCount',
    //   sorter: (a, b) => a.writeOffGoodsCount - b.writeOffGoodsCount,
    // },
    // {
    //   title: '地区/行业',
    //   align: 'center',
    //   dataIndex: 'districtCode',
    //   render: (val, row) => (
    //     <>
    //       <div> {checkCityName(val) || '--'} </div>
    //       <div>
    //         {row.topCategoryName} / {row.categoryName}
    //       </div>
    //     </>
    //   ),
    // },
    // {
    //   title: '创建时间',
    //   align: 'center',
    //   dataIndex: 'createTime',
    //   render: (val, row) => `${val}\n${SUBMIT_TYPE[row?.creatorType]}--${row?.creatorName || ''}`,
    // },
    // {
    //   title: '推广位置',
    //   fixed: 'right',
    //   dataIndex: 'recommendType',
    //   render: (val, row) =>
    //     val
    //       ?.split(',')
    //       .map((item) => SPECIAL_RECOMMEND_TYPE[item])
    //       .join('\n'),
    // },
    {
      type: 'handle',
      dataIndex: 'goodsId',
      width: 150,
      render: (val, record, index) => {
        const { goodsId, ownerIdString: merchantId, status, deleteFlag } = record;
        return [
          {
            type: 'goodsCode',
            visible: ['1', '2'].includes(status), // '活动中'
            click: () =>
              fetchSpecialGoodsQrCode({ goodsId }, `${record.ownerName}-${record.goodsName}`, {
                goodsId,
                merchantId,
              }),
          },
          {
            type: 'info',
            click: () => fetchSpecialGoodsDetail(index, 'info'),
          },
          {
            title: '下架',
            auth: 'down',
            visible: status == '1', // 活动中 && 未删除
            click: () =>
              setVisibleRefuse({
                show: true,
                detail: record,
                formProps: { type: 'down', key: 'offShelfReason' },
              }),
          },
          {
            type: 'edit',
            // visible: ['1'].includes(status), // 活动中 && 未删除
            click: () => fetchSpecialGoodsDetail(index, 'edit'),
          },
          {
            type: 'again', //重新发布
            visible: ['0'].includes(status), // 已下架 && 未删除
            click: () => fetchSpecialGoodsDetail(index, 'again'),
          },
          {
            type: 'againUp', // 再次上架
            title: '编辑',
            visible: ['0'].includes(status), // 已下架 && 未删除
            click: () => fetchSpecialGoodsDetail(index, 'againUp'),
          },
          // {
          //   type: 'diary',
          //   click: () => fetchGetLogData({ type: 'specialGoods', identificationId: val }),
          // },
          {
            title: '增加库存',
            type: 'addRemain',
            visible: ['1'].includes(status),
            click: () => fetAddRemain(goodsId, record.ownerIdString, record.remain),
          },
          {
            title: '分享配置',
            type: 'shareImg',
            click: () => fetchShareImg(record),
          },
        ];
      },
    },
  ];

  // 分享配置
  const fetchShareImg = (record) => {
    const { goodsId, ownerIdString, goodsName, ownerName } = record;
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDetail',
      payload: { goodsId, ownerId: ownerIdString },
      callback: (val) => {
        const { shareImg, friendShareImg, recommendReason, customTitle } = val;
        const initialValues = {
          shareImg,
          friendShareImg,
          recommendReason,
          customTitle,
        };
        setVisibleShare({
          show: true,
          goodsName,
          ownerName,
          goodsId,
          ownerIdString,
          initialValues,
        });
      },
    });
  };

  // 获取商品码
  const fetchSpecialGoodsQrCode = (payload, title, data) => {
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsQrCode',
      payload,
      callback: (url) => setQrcode({ url, title, data }),
    });
  };

  // 获取日志信息
  const fetchGetLogData = (payload) => {
    dispatch({
      type: 'baseData/fetchGetLogDetail',
      payload,
    });
  };

  // 增加库存
  const fetAddRemain = (id, ownerId, remain) => {
    setVisibleRemain({
      show: true,
      id,
      ownerId,
      remain,
    });
  };

  // 下架
  const fetchSpecialGoodsStatus = (values) => {
    const { goodsId, ownerIdString } = visibleRefuse.detail;
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsStatus',
      payload: {
        ...values,
        goodsId: goodsId,
        ownerId: ownerIdString,
      },
      callback: () => {
        setVisibleRefuse({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

  // 推荐
  const fetchSpecialGoodsRecommend = (payload) => {
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsRecommend',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 获取详情
  const fetchSpecialGoodsDetail = (index, type) => {
    const { goodsId, ownerIdString, ownerName, ownerType } = list[index];
    // if (type === 'edit') {
    //   dispatch({
    //     type: 'specialGoods/fetchEditCurrentStatus',
    //     payload: {
    //       ownerId: ownerIdString,
    //       ownerServiceId: goodsId,
    //       ownerType,
    //     },
    //     callback: (val) => {
    //       if (val !== '1') {
    //         return;
    //       }
    //     },
    //   });
    // }
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDetail',
      payload: { goodsId, ownerId: ownerIdString, type },
      callback: (val) => {
        const { status } = val;
        const newProps = {
          show: true,
          detail: { ...val, merchantName: ownerName, ownerType },
        };
        if (type == 'info') {
          setVisibleInfo({ status, index, ...newProps, goodsId, ownerIdString });
        } else {
          console.log({ type, ...newProps, goodsId, ownerIdString });
          setVisibleSet({ type, ...newProps, goodsId, ownerIdString });
        }
      },
    });
  };

  const extraBtn = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'specialGoods/fetchSpecialGoodsImport',
      data: get(),
      exportProps: excelProps,
    },
  ];

  const btnList = [
    {
      auth: 'save',
      onClick: () => setVisibleSet({ type: 'add', show: true }),
    },
  ];
  return (
    <>
      <TableDataBlock
        btnExtra={extraBtn}
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
          extra: (
            <ExtraButton list={btnList}>
              <AuthConsumer auth={'recommendStatus'}>
                <SpecialRecommendMenu
                  num={goodsList.length}
                  tabKey={tabKey}
                  handleRecommend={(val) =>
                    fetchSpecialGoodsRecommend({ goodsId: goodsList.toString(), ...val })
                  }
                  disabled={!goodsList.length}
                ></SpecialRecommendMenu>
              </AuthConsumer>
            </ExtraButton>
          ),
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ deleteFlag: '1', selfTourFlag: tabKey }}
        rowKey={(record) => `${record.goodsId}`}
        rowSelection={{
          getCheckboxProps: ({ status, deleteFlag }) => ({
            disabled: !['1', '2'].includes(status) || deleteFlag == '0', // 不是 活动中 即将开始 || 已删除
          }),
          onChange: setGoodsList,
        }}
        dispatchType="specialGoods/fetchGetList"
        {...specialGoods}
      ></TableDataBlock>
      <PreferentialDrawer
        childRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false })}
      ></PreferentialDrawer>
      {/* 详情 */}
      <SpecialGoodDetail
        visible={visibleInfo}
        total={list.length}
        getDetail={fetchSpecialGoodsDetail}
        onEdit={() =>
          //  活动中的编辑
          setVisibleSet({
            // type: [false, 'active', 'edit'][visibleInfo.status],
            type: 'edit',
            show: true,
            detail: visibleInfo ? visibleInfo.detail : {},
          })
        }
        onClose={() => setVisibleInfo(false)}
      ></SpecialGoodDetail>
      {/* 下架原因 */}
      <RefuseModal
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse({ show: false, detail: {} })}
        handleUpData={fetchSpecialGoodsStatus}
        loading={loadings.models.specialGoods}
      ></RefuseModal>
      {/* 商品码 */}
      <QrCodeShow {...qrcode} onCancel={() => setQrcode({})}></QrCodeShow>
      {/* 库存总量 */}
      <RemainModal
        childRef={childRef}
        visible={visibleRemain}
        onClose={() => setVisibleRemain(false)}
      ></RemainModal>
      {/* 分享配置 */}
      <ShareImg visible={visibleShare} onClose={() => setVisibleShare(false)}></ShareImg>
    </>
  );
};

export default connect(({ specialGoods, baseData, loading }) => ({
  specialGoods,
  hubData: baseData.hubData,
  loading: loading.models.specialGoods || loading.effects['baseData/fetchGetLogDetail'],
  loadings: loading,
}))(SpecialGoods);
