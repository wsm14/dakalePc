import React, { useRef, useState } from 'react';
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
import { LogDetail, RefuseModal } from '@/components/PublicComponents';
import ExtraButton from '@/components/ExtraButton';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import SpecialRecommendMenu from './components/SpecialGoods/SpecialRecommendMenu';
import PreferentialDrawer from './components/SpecialGoods/PreferentialDrawer';
import SpecialGoodDetail from './components/SpecialGoods/SpecialGoodDetail';
import QrCodeShow from './components/SpecialGoods/Detail/QrCodeShow';
import excelProps from './components/SpecialGoods/ExcelProps';

const SpecialGoods = (props) => {
  const { specialGoods, loading, loadings, hubData, dispatch } = props;
  const { list } = specialGoods;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [searchType, setSearchType] = useState(null); // 搜索类型
  const [goodsList, setGoodsList] = useState([]); // 选择推荐的商品
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 审核拒绝 下架原因
  const [qrcode, setQrcode] = useState({ url: null, title: '' }); // 商品码

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
  const searchItems = [
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
  const getColumns = [
    {
      title: '商品/店铺名称',
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
    {
      title: '推广位置',
      fixed: 'right',
      dataIndex: 'recommendType',
      render: (val, row) => {
        if ((row.recommendStatus === '0' && (row.topStatus === '0' || !row.topStatus)) || !val)
          return '';
        // let tagName = row.topStatus === '0' ? '推荐' : '置顶';
        return SPECIAL_RECOMMEND_TYPE[val];
      },
    },
    {
      type: 'handle',
      dataIndex: 'specialGoodsId',
      width: 150,
      render: (val, record, index) => {
        const { specialGoodsId, ownerIdString: merchantId, status, deleteFlag } = record;
        return [
          {
            type: 'goodsCode',
            visible: ['1', '2'].includes(status) && deleteFlag == '1', // '活动中'
            click: () =>
              fetchSpecialGoodsQrCode(
                { specialGoodsId },
                `${record.merchantName}-${record.goodsName}`,
                { specialGoodsId, merchantId },
              ),
          },
          {
            type: 'info',
            click: () => fetchSpecialGoodsDetail(index, 'info'),
          },
          {
            title: '下架',
            auth: 'down',
            visible: status == '1' && deleteFlag == '1', // 活动中 && 未删除
            click: () =>
              setVisibleRefuse({
                show: true,
                detail: record,
                formProps: { type: 'down', key: 'offShelfReason' },
              }),
          },
          {
            type: 'edit',
            visible: ['1'].includes(status) && deleteFlag == '1', // 活动中 && 未删除
            click: () => fetchSpecialGoodsDetail(index, [false, 'active', 'edit'][status]),
          },

          {
            type: 'again', //重新发布
            visible: ['0'].includes(status) && deleteFlag == '1', // 已下架 && 未删除
            click: () => fetchSpecialGoodsDetail(index, 'again'),
          },
          {
            type: 'againUp', //再次上架
            title: '再次上架',
            visible: ['0'].includes(status) && deleteFlag == '1', // 已下架 && 未删除
            click: () => fetchSpecialGoodsDetail(index, 'againUp'),
          },
          {
            type: 'diary',
            click: () => fetchGetLogData({ type: 'specialGoods', identificationId: val }),
          },
        ];
      },
    },
  ];

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

  // 下架
  const fetchSpecialGoodsStatus = (values) => {
    const { specialGoodsId, ownerIdString } = visibleRefuse.detail;
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsStatus',
      payload: {
        ...values,
        id: specialGoodsId,
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
    const { specialGoodsId, ownerIdString, merchantName, ownerType } = list[index];
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDetail',
      payload: { specialGoodsId, ownerId: ownerIdString, type },
      callback: (val) => {
        const { status } = val;
        const newProps = {
          show: true,
          detail: { ...val, merchantName, ownerType },
        };
        if (type == 'info') {
          setVisibleInfo({ status, index, ...newProps, specialGoodsId, ownerIdString });
        } else {
          setVisibleSet({ type, ...newProps, specialGoodsId, ownerIdString });
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
        keepData
        btnExtra={extraBtn}
        cardProps={{
          extra: (
            <ExtraButton list={btnList}>
              <SpecialRecommendMenu
                num={goodsList.length}
                handleRecommend={(val) =>
                  fetchSpecialGoodsRecommend({ specialGoodsId: goodsList.toString(), ...val })
                }
                disabled={!goodsList.length}
              ></SpecialRecommendMenu>
            </ExtraButton>
          ),
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.specialGoodsId}`}
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
          setVisibleSet({
            type: [false, 'active', 'edit'][visibleInfo.status],
            show: true,
            detail: visibleInfo ? visibleInfo.detail : {},
          })
        }
        onClose={() => setVisibleInfo(false)}
      ></SpecialGoodDetail>
      {/* 日志 */}
      <LogDetail></LogDetail>
      {/* 下架原因 */}
      <RefuseModal
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse({ show: false, detail: {} })}
        handleUpData={fetchSpecialGoodsStatus}
        loading={loadings.models.specialGoods}
      ></RefuseModal>
      {/* 商品码 */}
      <QrCodeShow {...qrcode} onCancel={() => setQrcode({})}></QrCodeShow>
    </>
  );
};

export default connect(({ specialGoods, baseData, loading }) => ({
  specialGoods,
  hubData: baseData.hubData,
  loading: loading.models.specialGoods || loading.effects['baseData/fetchGetLogDetail'],
  loadings: loading,
}))(SpecialGoods);
