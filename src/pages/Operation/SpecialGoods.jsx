import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag, Button, Space } from 'antd';
import {
  BUSINESS_TYPE,
  SPECIAL_STATUS,
  GOODS_CLASS_TYPE,
  SPECIAL_USERTIME_TYPE,
  SPECIAL_RECOMMEND_TYPE,
  SPECIAL_RECOMMEND_LISTTYPE,
} from '@/common/constant';
import { LogDetail, RefuseModal } from '@/components/PublicComponents';
import AuthConsumer from '@/layouts/AuthConsumer';
import Ellipsis from '@/components/Ellipsis';
import ExcelButton from '@/components/ExcelButton';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import SpecialGoodsTrade from './components/SpecialGoods/SpecialGoodsTrade';
import SpecialRecommendMenu from './components/SpecialGoods/SpecialRecommendMenu';
import PreferentialDrawer from './components/SpecialGoods/PreferentialDrawer';
import SpecialGoodDetail from './components/SpecialGoods/SpecialGoodDetail';
import excelProps from './components/SpecialGoods/ExcelProps';

const SpecialGoods = (props) => {
  const { specialGoods, loading, loadings, hubData, dispatch } = props;
  const { list } = specialGoods;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [searchType, setSearchType] = useState(null); // 搜索类型
  const [goodsList, setGoodsList] = useState([]); // 选择推荐的商品
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 审核拒绝 下架原因

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
      label: '佣金',
      name: 'commission',
      type: 'numberGroup',
    },
    {
      label: '有效期',
      name: { gain: 'activeDays', fixed: 'useStartTime' }[searchType],
      disabled: !searchType,
      type: { gain: 'number', fixed: 'rangePicker' }[searchType],
      end: 'useEndTime',
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
  ];

  // table 表头
  const getColumns = [
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
      dataIndex: 'realPrice',
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
          <div>{SPECIAL_STATUS[row.status]}</div>
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
      title: '审核通过时间',
      dataIndex: 'createTime',
    },
    {
      title: '推广位置',
      fixed: 'right',
      dataIndex: 'recommendType',
      render: (val, row) => {
        if ((row.recommendStatus === '0' && (row.topStatus === '0' || !row.topStatus)) || !val)
          return '';
        let tagName = row.topStatus === '0' ? '推荐' : '置顶';
        return SPECIAL_RECOMMEND_LISTTYPE[val] + tagName;
      },
    },
    {
      title: '操作',
      dataIndex: 'specialGoodsId',
      align: 'right',
      fixed: 'right',
      width: 150,
      render: (val, record, index) => {
        const { specialGoodsId, merchantIdStr, status } = record;
        return (
          <HandleSetTable
            formItems={[
              // {
              //   type: 'goodsCode',
              //   visible: status !== '3', // '已下架', '活动中', '审核中'
              //   click: () => fetchSpecialGoodsDetail(index, 'info'),
              // },
              {
                type: 'info',
                click: () => fetchSpecialGoodsDetail(index, 'info'),
              },
              {
                type: 'down',
                visible: status == '1',
                click: () =>
                  setVisibleRefuse({
                    show: true,
                    detail: record,
                    formProps: { type: 'down', key: 'offShelfReason' },
                  }),
              },
              {
                type: 'edit',
                visible: ['1', '2'].includes(status), // 活动中 即将开始
                click: () => fetchSpecialGoodsDetail(index, [false, 'active', 'edit'][status]),
              },
              {
                type: 'check',
                visible: ['3'].includes(status), // 活动中 审核中
                click: () => fetchSpecialGoodsDetail(index, 'info'),
              },
              {
                type: 'del',
                visible: ['0'].includes(status), // 已下架
                click: () => fetchSpecialGoodsDel({ specialGoodsId, merchantIdStr, status }),
              },
              {
                type: 'again',
                visible: ['0'].includes(status), // 已下架
                click: () => fetchSpecialGoodsDetail(index, 'again'),
              },
              {
                pop: true,
                title: '取消推荐',
                auth: 'placement',
                visible: record.recommendStatus !== '0' || record.topStatus !== '0',
                click: () =>
                  fetchSpecialGoodsRecommend({ specialGoodsId, operationFlag: 'cancel' }),
              },
              // {
              //   type: 'diary',
              //   click: () => fetchGetLogData(),
              // },
            ]}
          />
        );
      },
    },
  ];

  // 获取日志信息
  const fetchGetLogData = (payload) => {
    dispatch({
      type: 'baseData/fetchGetLogData',
      payload,
    });
  };

  // 删除
  const fetchSpecialGoodsDel = (payload) => {
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDel',
      payload,
    });
  };

  // 审核
  const fetchSpecialGoodsVerify = (values) => {
    const { merchantIdStr, specialGoodsId } = visibleRefuse.detail;
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsVerify',
      payload: {
        merchantIdStr,
        specialGoodsId,
        status: 4,
        ...values,
      },
      callback: () => {
        setVisibleInfo(false);
        setVisibleRefuse({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

  // 下架
  const fetchSpecialGoodsStatus = (values) => {
    const { merchantIdStr, specialGoodsId, status } = visibleRefuse.detail;
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsStatus',
      payload: {
        ...values,
        merchantIdStr,
        specialGoodsId,
        status,
      },
      callback: () => {
        setVisibleRefuse({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

  // 推荐状态 / 置顶状态
  const fetchSpecialGoodsRecommend = (payload) => {
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsRecommend',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 获取详情
  const fetchSpecialGoodsDetail = (index, type) => {
    const { specialGoodsId, merchantIdStr, merchantName, ownerType } = list[index];
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDetail',
      payload: { specialGoodsId, merchantIdStr, type },
      callback: (val) => {
        const { status } = val;
        const newProps = {
          show: true,
          detail: { ...val, merchantName, ownerType, specialGoodsId, merchantIdStr },
        };
        if (type == 'info') {
          setVisibleInfo({ status, index, ...newProps });
        } else {
          setVisibleSet({ type, ...newProps });
        }
      },
    });
  };

  return (
    <>
      <TableDataBlock
        keepData
        btnExtra={({ get }) => (
          <>
            <ExcelButton
              dispatchType={'specialGoods/fetchSpecialGoodsImport'}
              dispatchData={get()}
              exportProps={excelProps}
            ></ExcelButton>
          </>
        )}
        cardProps={{
          extra: (
            <Space>
              <AuthConsumer auth="save">
                <Button
                  className="dkl_green_btn"
                  onClick={() => setVisibleSet({ type: 'add', show: true })}
                >
                  新增
                </Button>
              </AuthConsumer>
              <SpecialRecommendMenu
                num={goodsList.length}
                handleRecommend={(val) =>
                  fetchSpecialGoodsRecommend({ specialGoodsId: goodsList.toString(), ...val })
                }
                disabled={!goodsList.length}
              ></SpecialRecommendMenu>
            </Space>
          ),
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.specialGoodsId}`}
        rowSelection={{
          onChange: setGoodsList,
        }}
        dispatchType="specialGoods/fetchGetList"
        {...specialGoods}
      ></TableDataBlock>
      <SpecialGoodsTrade
        visible={visible}
        onCancel={() => setVisible({ show: false })}
      ></SpecialGoodsTrade>
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
        setVisibleRefuse={setVisibleRefuse}
        fetchSpecialGoodsVerify={fetchSpecialGoodsVerify}
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
      {/* 审核拒绝 下架原因 */}
      <RefuseModal
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse({ show: false, detail: {} })}
        handleUpData={
          visibleRefuse.type === 'refuse' ? fetchSpecialGoodsVerify : fetchSpecialGoodsStatus
        }
        loading={loadings.models.specialGoods}
      ></RefuseModal>
    </>
  );
};

export default connect(({ specialGoods, baseData, loading }) => ({
  specialGoods,
  hubData: baseData.hubData,
  loading: loading.models.specialGoods,
  loadings: loading,
}))(SpecialGoods);
