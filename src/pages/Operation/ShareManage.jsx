import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tag, Button } from 'antd';
import { MreSelect } from '@/components/MerUserSelectTable';
import { SHARE_TYPE, SHARE_STATUS, BUSINESS_TYPE } from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import AuthConsumer from '@/layouts/AuthConsumer';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';
import QuestionTooltip from '@/components/QuestionTooltip';
import ShareDetail from './components/Share/Detail/ShareDetail';
import VideoPeasDetail from './components/Share/Detail/VideoPeasDetail';
import ShareHandleDetail from './components/Share/Detail/ShareHandleDetail';
import ShareVideoDetail from './components/Share/Detail/ShareVideoDetail';
import ShareDrawer from './components/Share/ShareDrawer';
import ShareLikeDateSet from './components/Share/ShareLikeDateSet';
import Ellipsis from '@/components/Ellipsis';
import styles from './style.less';

const ShareManage = (props) => {
  const { shareManage, loading, loadingRefuse, tradeList, dispatch } = props;
  const { list } = shareManage;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 详情
  const [visibleShare, setVisibleShare] = useState(false); // 发布分享
  const [visibleMre, setVisibleMre] = useState(false); // 商户详情
  const [visibleVideo, setVisibleVideo] = useState(false); // 视屏
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 下架原因
  const [visibleHandle, setVisibleHandle] = useState(false); // 操作记录
  const [visiblePeas, setVisiblePeas] = useState(false); // 领豆明细
  const [visibleLike, setVisibleLike] = useState(false); // 设置分享收藏数

  // 搜索参数
  const searchItems = [
    {
      label: '分享标题',
      name: 'title',
    },
    {
      label: '集团/店铺名称',
      name: 'merchantName',
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
    {
      label: '状态',
      type: 'select',
      name: 'status',
      select: SHARE_STATUS,
    },
    {
      label: '分享类型',
      type: 'select',
      name: 'contentType',
      select: SHARE_TYPE,
    },
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '店铺类型',
      name: 'userType',
      type: 'select',
      select: BUSINESS_TYPE,
    },
    {
      label: '行业',
      type: 'cascader',
      name: 'topCategoryId',
      changeOnSelect: true,
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      valuesKey: ['topCategoryId', 'categoryId'],
    },
    {
      label: '卡豆余额',
      type: 'number',
      name: 'remainBean',
      formatter: (value) => `< ${value}`,
      parser: (value) => value.replace(/\<\s?/g, ''),
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '视频/标题',
      fixed: 'left',
      dataIndex: 'frontImage',
      width: 280,
      render: (val, detail) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <PopImgShow url={val}></PopImgShow>
          </div>
          <div style={{ marginLeft: '15px' }}>
            <Ellipsis length={10} tooltip lines={3}>
              {detail.title}
            </Ellipsis>
          </div>
        </div>
      ),
    },
    {
      title: '店铺/集团',
      dataIndex: 'userType',
      width: 320,
      render: (val, row) => (
        <>
          <div style={{ display: 'flex' }}>
            <Tag>{BUSINESS_TYPE[val]}</Tag>
            <Ellipsis length={15} tooltip>
              {row.merchantName}
            </Ellipsis>
          </div>
          <div style={{ display: 'flex', marginTop: 5 }}>
            <Tag color={'magenta'}>{`${row.topCategoryName}-${row.categoryName}`}</Tag>
            <span>{`${row.provinceName}-${row.cityName}-${row.districtName}`}</span>
          </div>
        </>
      ),
    },
    {
      title: '单次打赏卡豆数',
      align: 'right',
      dataIndex: 'beanAmount',
      render: (val = 0, row) => Math.round(val + (row.exposureBeanAmount || 0)),
      sorter: (a, b) =>
        Math.round(a.beanAmount + (a.exposureBeanAmount || 0)) -
        Math.round(b.beanAmount + (b.exposureBeanAmount || 0)),
    },
    {
      title: (
        <QuestionTooltip
          type="quest"
          title="观看人数（人）"
          content={`观看视频3s及以上的人数`}
        ></QuestionTooltip>
      ),
      align: 'right',
      dataIndex: 'viewAmount',
      sorter: (a, b) => a.viewAmount - b.viewAmount,
    },
    {
      title: '领卡豆人数（人）',
      align: 'right',
      dataIndex: 'payedPersonAmount',
      sorter: (a, b) => a.payedPersonAmount - b.payedPersonAmount,
    },

    {
      title: '累计打赏卡豆数',
      align: 'right',
      dataIndex: 'exposureBeanAmount',
      render: (val = 0, row) => Math.round((val + (row.beanAmount || 0)) * row.payedPersonAmount),
      sorter: (a, b) =>
        (a.exposureBeanAmount + (a.beanAmount || 0)) * a.payedPersonAmount -
        (b.exposureBeanAmount + (b.beanAmount || 0)) * b.payedPersonAmount,
    },
    {
      title: '剩余卡豆数',
      align: 'right',
      dataIndex: 'beanPersonAmount',
      render: (val = 0, row) =>
        Math.round(
          ((row.beanAmount || 0) + (row.exposureBeanAmount || 0)) *
            ((row.beanPersonAmount || 0) - row.payedPersonAmount || 0),
        ),
      sorter: (a, b) =>
        ((a.beanAmount || 0) + (a.exposureBeanAmount || 0)) *
          ((a.beanPersonAmount || 0) - (a.payedPersonAmount || 0)) -
        ((b.beanAmount || 0) + (b.exposureBeanAmount || 0)) *
          ((b.beanPersonAmount || 0) - (b.payedPersonAmount || 0)),
    },
    {
      title: '关联券/商品',
      align: 'right',
      dataIndex: 'freeOwnerCoupon',
      align: 'right',
      width: 250,
      render: (val, row) => {
        const { specialGoods, valuableOwnerCoupon: cInfo } = row;
        const freeInfo = val ? `${val.couponName}（${val.remain}）` : '';
        const goodsInfo = specialGoods ? `${specialGoods.goodsName}（${specialGoods.remain}）` : '';
        const couponInfo = cInfo ? `${cInfo.couponName}（${cInfo.remain}）` : '';
        const pontInfo = goodsInfo || couponInfo;
        return `${freeInfo}\n${pontInfo}`;
      },
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.creatorName || ''}`,
    },
    {
      title: '状态',
      fixed: 'right',
      align: 'right',
      dataIndex: 'status',
      render: (val) => SHARE_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'length',
      width: 150,
      fixed: 'right',
      align: 'right',
      render: (val, record, index) => {
        const { status, userMomentIdString } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                title: '审核通过',
                auth: 'check',
                pop: true,
                visible: status == 0,
                click: () => fetchVerifyAllow({ userMomentIdString }),
              },
              {
                title: '下架',
                auth: 'down', // 下架
                visible: status == 1 || status == 0,
                click: () =>
                  setVisibleRefuse({
                    show: true,
                    detail: record,
                    formProps: { type: 'down', key: 'removalReason' },
                  }),
              },
              {
                type: 'info', // 详情
                click: () => fetchShareDetail(index, record.contentType || 'video'),
              },
              {
                type: 'set', // 设置假数据
                click: () => fetchShareDetail(index, 'set'),
              },
              {
                type: 'diary', // 日志
                click: () => fetchShareHandleDetail(userMomentIdString),
              },
              {
                type: 'peasDetail',
                title: '领豆明细',
                click: () => setVisiblePeas({ show: true, detail: record }),
              },
            ]}
          />
        );
      },
    },
  ];

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 获取行业选择项
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 审核通过
  const fetchVerifyAllow = (payload) => {
    dispatch({
      type: 'shareManage/fetchShareVerifyAllow',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 下架
  const fetchStatusClose = (values) => {
    const { detail } = visibleRefuse;
    dispatch({
      type: 'shareManage/fetchStatusClose',
      payload: {
        merchantId: detail.merchantIdString,
        momentId: detail.userMomentIdString,
        ...values,
      },
      callback: () => {
        setVisibleRefuse({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

  // 获取详情
  const fetchShareDetail = (index, type) => {
    const { userMomentIdString } = list[index];
    dispatch({
      type: 'shareManage/fetchShareDetail',
      payload: {
        userMomentIdString,
      },
      callback: (detail) =>
        type === 'set'
          ? setVisibleLike({ show: true, detail })
          : setVisible({ show: true, index, type, detail }),
    });
  };

  // 获取操作日志详情
  const fetchShareHandleDetail = (val) => {
    dispatch({
      type: 'baseData/fetchHandleDetail',
      payload: {
        identifyIdStr: val,
      },
      callback: (detail) => setVisibleHandle({ show: true, detail }),
    });
  };

  return (
    <>
      <TableDataBlock
        keepData
        btnExtra={
          <AuthConsumer auth="save">
            <Button
              className="dkl_green_btn"
              onClick={() => setVisibleShare({ type: 'add', show: true })}
            >
              新增
            </Button>
          </AuthConsumer>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowClassName={(row) => {
          const { freeOwnerCoupon = {}, specialGoods = {}, valuableOwnerCoupon = {} } = row;
          const freeRemain = (freeOwnerCoupon.remain || 999999) <= 10;
          const goodsRemain = (specialGoods.remain || 999999) <= 10;
          const couponRemain = (valuableOwnerCoupon.remain || 999999) <= 10;
          return (freeRemain || goodsRemain || couponRemain) &&
            [0, 1, 6].includes(Number(row.status))
            ? styles.share_rowColor
            : '';
        }}
        rowKey={(record) => `${record.userMomentIdString}`}
        dispatchType="shareManage/fetchGetList"
        {...shareManage}
      ></TableDataBlock>
      {/* 发布分享 */}
      <ShareDrawer
        childRef={childRef}
        visible={visibleShare}
        onClose={() => setVisibleShare(false)}
      ></ShareDrawer>
      {/* 详情 */}
      <ShareDetail
        total={list.length}
        visible={visible}
        getDetail={fetchShareDetail}
        onClose={() => setVisible(false)}
      ></ShareDetail>
      {/* 视频详情 */}
      <ShareVideoDetail
        visible={visibleVideo}
        onClose={() => setVisibleVideo(false)}
      ></ShareVideoDetail>
      {/* 操作记录 */}
      <ShareHandleDetail
        visible={visibleHandle}
        onClose={() => setVisibleHandle(false)}
      ></ShareHandleDetail>
      {/* 下架 */}
      <RefuseModal
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse({ show: false, detail: {} })}
        handleUpData={fetchStatusClose}
        loading={loadingRefuse}
      ></RefuseModal>
      {/* 查看商户 */}
      <MreSelect type="show" visible={visibleMre} onCancel={() => setVisibleMre(false)}></MreSelect>
      {/* 领豆明细 */}
      <VideoPeasDetail
        visible={visiblePeas}
        onClose={() => setVisiblePeas(false)}
      ></VideoPeasDetail>
      {/* 设置分享数 收藏数 */}
      <ShareLikeDateSet
        visible={visibleLike}
        onClose={() => setVisibleLike(false)}
      ></ShareLikeDateSet>
    </>
  );
};

export default connect(({ sysTradeList, shareManage, loading }) => ({
  shareManage,
  tradeList: sysTradeList.list.list,
  loadingRefuse: loading.effects['shareManage/fetchStatusClose'],
  loading:
    loading.effects['shareManage/fetchGetList'] ||
    loading.effects['shareManage/fetchShareDetail'] ||
    loading.effects['baseData/fetchHandleDetail'],
}))(ShareManage);
