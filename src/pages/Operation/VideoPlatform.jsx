import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { checkCityName } from '@/utils/utils';
import { NEW_SHARE_STATUS, TEMPLATE_CREATE_TYPE, NEW_SHARE_OWNER } from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import QuestionTooltip from '@/components/QuestionTooltip';
import ShareImg from './components/VideoPlatform/ShareImg';
import RewardSet from './components/VideoPlatform/RewardSet';
import ShareDrawer from './components/VideoPlatform/ShareDrawer';
import ShareWeightSet from './components/VideoPlatform/ShareWeightSet';
import ShareDetail from './components/VideoPlatform/Detail/ShareDetail';

const tabList = [
  {
    key: '0',
    tab: '未打赏视频',
  },
  {
    key: '1',
    tab: '已打赏视频',
  },
];

const VideoPlatform = (props) => {
  const { videoPlatform, loading, loadingRefuse, tradeList, dispatch } = props;
  const { list } = videoPlatform;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('0'); // tab
  const [visible, setVisible] = useState(false); // 详情
  const [visibleShare, setVisibleShare] = useState(false); // 发布分享
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 下架原因
  const [visibleImg, setVisibleImg] = useState(false); // 分享图
  const [visibleReward, setVisibleReward] = useState(false); // 打赏设置

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ beanFlag: tabKey, page: 1 });
  }, [tabKey]);

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '视频ID',
      name: 'momentId',
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
      label: '视频类型',
      name: 'userType',
      type: 'select',
      select: NEW_SHARE_OWNER,
    },
    {
      label: '哒人昵称',
      name: 'ownerId',
      type: 'user',
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
      select: NEW_SHARE_STATUS,
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
      dataIndex: 'ownerType',
      width: 320,
      render: (val, row) => (
        <>
          <div style={{ display: 'flex' }}>
            <Tag>{NEW_SHARE_OWNER[val]}</Tag>
            <Ellipsis length={15} tooltip>
              {row.ownerName}
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
      title: '观看人数',
      align: 'right',
      dataIndex: 'viewAmount',
      sorter: (a, b) => a.viewAmount - b.viewAmount,
    },
    {
      title: '领卡豆人数',
      align: 'right',
      dataIndex: 'personAmount',
      sorter: (a, b) => a.personAmount - b.personAmount,
    },

    {
      title: '累计打赏卡豆数',
      align: 'right',
      dataIndex: 'beanAmount',
      sorter: (a, b) => a.beanAmount - b.beanAmount,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) =>
        `${val}\n${TEMPLATE_CREATE_TYPE[row.creatorType]} ${row.creatorName || ''}`,
    },
    {
      title: <QuestionTooltip type="quest" title="权重" content="数值越大越靠前"></QuestionTooltip>,
      align: 'center',
      fixed: 'right',
      show: tabKey === '1',
      dataIndex: 'weight',
      render: (val, row) => (
        <ShareWeightSet detail={row} onSubmit={fetchNewShareNoAudit}></ShareWeightSet>
      ),
    },
    {
      title: '状态',
      fixed: 'right',
      align: 'right',
      dataIndex: 'status',
      render: (val) => NEW_SHARE_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'momentId',
      width: 210,
      render: (val, record, index) => {
        const { status, creatorType } = record;
        const typeUser = !(creatorType === 'user');
        return [
          {
            type: 'info', // 详情
            click: () => fetchShareDetail(index),
          },
          {
            type: 'down', // 下架
            pop: false,
            visible: status == 1 || status == 2,
            click: () =>
              setVisibleRefuse({
                show: true,
                detail: record,
                formProps: { type: 'down', key: 'removalReason' },
              }),
          },
          {
            type: 'del', // 删除
            visible: status == 0,
            click: () => fetchNewShareDel(record),
          },
          {
            type: 'edit', // 编辑
            visible: status != 0 && typeUser,
            click: () => fetchShareDetail(index, 'edit'),
          },
          {
            type: 'rewardPeo', // 打赏设置
            visible: status != 0 && typeUser,
            click: () => setVisibleReward({ show: true, detail: record }),
          },
          {
            type: 'shareImg', // 分享图
            click: () => setVisibleImg({ show: true, detail: record }),
          },
          {
            type: 'commerceSet', // 带货设置
            visible: status != 0 && typeUser,
            click: () => fetchShareDetail(index, 'commerce'),
          },
          // {
          //   type: 'portraitEdit', // 编辑画像
          //   visible: status != 0 && typeUser,
          //   click: () => fetchShareDetail(index, 'portrait'),
          // },
        ];
      },
    },
  ];

  // 获取行业选择项
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 删除
  const fetchNewShareDel = (detail) => {
    const { momentId, ownerId } = detail;
    dispatch({
      type: 'videoPlatform/fetchNewShareDel',
      payload: {
        momentId,
        ownerId,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // 下架
  const fetchStatusClose = (values) => {
    const { momentId, ownerId } = visibleRefuse;
    dispatch({
      type: 'videoPlatform/fetchNewShareClose',
      payload: {
        momentId,
        ownerId,
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
    const { momentId, ownerId } = list[index];
    dispatch({
      type: 'videoPlatform/fetchNewShareDetail',
      payload: {
        momentId,
        ownerId,
        type,
      },
      callback: (detail) => setVisible({ show: true, index, type, detail }),
    });
  };

  // 修改不审核
  const fetchNewShareNoAudit = (values, callback) => {
    dispatch({
      type: 'videoPlatform/fetchNewShareNoAudit',
      payload: values,
      callback,
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
        cardProps={{ tabList: tabList, activeTabKey: tabKey, onTabChange: setTabKey }}
        btnExtra={extraBtn}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ beanFlag: tabKey }}
        rowKey={(record) => `${record.momentId}`}
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
        fetchNewShareNoAudit={fetchNewShareNoAudit}
      ></ShareDetail>
      {/* 下架 */}
      <RefuseModal
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse({ show: false, detail: {} })}
        handleUpData={fetchStatusClose}
        loading={loadingRefuse}
      ></RefuseModal>
      {/* 分享图 */}
      <ShareImg
        visible={visibleImg}
        childRef={childRef}
        onSubmit={fetchNewShareNoAudit}
        onClose={() => setVisibleImg(false)}
      ></ShareImg>
      {/* 打赏设置 */}
      <RewardSet visible={visibleReward} onClose={() => setVisibleReward(false)}></RewardSet>
    </>
  );
};

export default connect(({ sysTradeList, videoPlatform, loading }) => ({
  videoPlatform: videoPlatform.list,
  tradeList: sysTradeList.list.list,
  loadingRefuse: loading.effects['videoPlatform/fetchNewShareClose'],
  loading:
    loading.effects['videoPlatform/fetchGetList'] ||
    loading.effects['videoPlatform/fetchNewShareDetail'],
}))(VideoPlatform);
