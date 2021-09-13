import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { checkCityName } from '@/utils/utils';
import { MreSelect } from '@/components/MerUserSelectTable';
import { SHARE_STATUS, BUSINESS_TYPE } from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import QuestionTooltip from '@/components/QuestionTooltip';
import RewardPeo from './components/VideoPlatform/RewardPeo';
import ShareDrawer from './components/VideoPlatform/ShareDrawer';
import ShareWeightSet from './components/VideoPlatform/ShareWeightSet';
import ShareDetail from './components/VideoPlatform/Detail/ShareDetail';
import ShareLikeDateSet from './components/VideoPlatform/ShareLikeDateSet';
import VideoPeasDetail from './components/VideoPlatform/Detail/VideoPeasDetail';
import ShareVideoDetail from './components/VideoPlatform/Detail/ShareVideoDetail';
import ShareHandleDetail from './components/VideoPlatform/Detail/ShareHandleDetail';
import styles from './style.less';

const tabList = [
  {
    key: 'user',
    tab: '未打赏视频',
  },
  {
    key: 'merchant',
    tab: '已打赏视频',
  },
];

const VideoPlatform = (props) => {
  const { videoPlatform, loading, loadingRefuse, tradeList, dispatch } = props;
  const { list } = videoPlatform;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('user'); // tab
  const [visible, setVisible] = useState(false); // 详情
  const [visibleShare, setVisibleShare] = useState(false); // 发布分享
  const [visibleMre, setVisibleMre] = useState(false); // 商户详情
  const [visibleVideo, setVisibleVideo] = useState(false); // 视屏
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 下架原因
  const [visibleHandle, setVisibleHandle] = useState(false); // 操作记录
  const [visiblePeas, setVisiblePeas] = useState(false); // 领豆明细
  const [visibleLike, setVisibleLike] = useState(false); // 设置分享收藏数
  const [visibleReward, setVisibleReward] = useState(false); // 新增打赏人数

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ matterType: tabKey, page: 1 });
  }, [tabKey]);

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '视频类型',
      name: 'title',
    },
    {
      label: '视频ID',
      name: 'title',
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
      label: '哒人昵称',
      name: 'title',
    },
    {
      label: '分享标题',
      name: 'title',
    },
    {
      label: '集团/店铺名',
      name: 'ownerId',
      type: 'merchant',
    },
    {
      label: '状态',
      type: 'select',
      name: 'status',
      select: SHARE_STATUS,
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
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
        <PopImgShow url={val}>
          <Ellipsis length={10} tooltip lines={3}>
            {detail.title}
          </Ellipsis>
        </PopImgShow>
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
            <Tag color="blue">{`${row.topCategoryName}-${row.categoryName}`}</Tag>
            <span>{checkCityName(row.districtCode)}</span>
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
      title: '观看人数',
      align: 'right',
      dataIndex: 'viewAmount',
      sorter: (a, b) => a.viewAmount - b.viewAmount,
    },
    {
      title: '领卡豆人数',
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
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.creatorName || ''}`,
    },
    {
      title: <QuestionTooltip type="quest" title="权重" content="数值越大越靠前"></QuestionTooltip>,
      align: 'center',
      fixed: 'right',
      dataIndex: 'weight',
      render: (val, row) => <ShareWeightSet detail={row}></ShareWeightSet>,
    },
    {
      title: '状态',
      fixed: 'right',
      align: 'right',
      dataIndex: 'status',
      render: (val) => SHARE_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'length',
      width: 180,
      render: (val, record, index) => {
        const { status, userMomentIdString, payedPersonAmount } = record;
        return [
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
            visible: payedPersonAmount > 0,
            click: () => setVisiblePeas({ show: true, detail: record }),
          },
          {
            type: 'rewardPeo',
            title: '新增打赏人数',
            visible: status == 1,
            click: () => fetRewardPeo(userMomentIdString, record),
          },
        ];
      },
    },
  ];

  //新增打赏人数
  const fetRewardPeo = (userMomentIdString, record) => {
    const { beanAmount, exposureBeanAmount } = record;
    setVisibleReward({
      show: true,
      userMomentIdString,
      beanAmount,
      exposureBeanAmount,
    });
  };

  // 获取行业选择项
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 下架
  const fetchStatusClose = (values) => {
    const { detail } = visibleRefuse;
    dispatch({
      type: 'videoPlatform/fetchStatusClose',
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
      type: 'videoPlatform/fetchShareDetail',
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

  const extraBtn = [
    {
      auth: 'save',
      text: '新增',
      onClick: () => setVisibleShare({ type: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        keepData
        firstFetch={false}
        cardProps={{ tabList: tabList, activeTabKey: tabKey, onTabChange: setTabKey }}
        btnExtra={extraBtn}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ matterType: tabKey }}
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
        dispatchType="videoPlatform/fetchGetList"
        {...videoPlatform}
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
      {/* //新增打赏人数 */}
      <RewardPeo
        visible={visibleReward}
        childRef={childRef}
        onClose={() => setVisibleReward(false)}
      ></RewardPeo>
    </>
  );
};

export default connect(({ sysTradeList, videoPlatform, loading }) => ({
  videoPlatform,
  tradeList: sysTradeList.list.list,
  loadingRefuse: loading.effects['videoPlatform/fetchStatusClose'],
  loading:
    loading.effects['videoPlatform/fetchGetList'] ||
    loading.effects['videoPlatform/fetchShareDetail'] ||
    loading.effects['baseData/fetchHandleDetail'],
}))(VideoPlatform);
