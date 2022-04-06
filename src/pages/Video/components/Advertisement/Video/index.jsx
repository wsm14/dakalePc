import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tag, Tooltip } from 'antd';
import {
  SHARE_AREA_TYPE,
  VIDEO_ADVERT_TYPE,
  VIDEO_ADVERT_STATUS,
  SUBMIT_TYPE_VIDEO,
} from '@/common/constant';
import { NUM_PATTERN } from '@/common/regExp';
import { checkCityName } from '@/utils/utils';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import WeightSet from './components/WeightSet';
import VideoSetDrawer from './components/VideoSetDrawer';
import VideoDetail from './components/Detail/VideoDetail';
import RewardSet from '../../VideoPlatform/RewardSet';
import VideoSet from '../../VideoPlatform/VideoSet';
import VideoPeasDetail from './components/Detail/VideoPeasDetail';

const ShareManage = (props) => {
  const { videoAdvert, loading, tagList, dispatch } = props;
  const { list } = videoAdvert;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 新增
  const [visibleDetail, setVisibleDetail] = useState(false); // 详情 编辑
  const [visibleReward, setVisibleReward] = useState(false); // 打赏设置
  const [visibleSet, setVisibleSet] = useState(false); // 设置
  const [visiblePeas, setVisiblePeas] = useState(false); // 领豆明细

  useEffect(() => {
    fetchGetUgcTag();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '状态',
      type: 'select',
      name: 'status',
      select: VIDEO_ADVERT_STATUS,
    },
    {
      label: '视频ID',
      name: 'platformMomentId',
      rules: [{ pattern: NUM_PATTERN, message: '请输入数字' }],
    },
    {
      label: '推荐位置',
      name: 'browseType',
      type: 'select',
      select: tagList,
    },
    {
      label: '分享内容',
      name: 'message',
    },
    {
      label: '卡豆余额',
      type: 'number',
      name: 'remainBean',
      formatter: (value) => `< ${value}`,
      parser: (value) => value.replace(/\<\s?/g, ''),
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
      title: '视频/内容详情',
      fixed: 'left',
      dataIndex: 'frontImage',
      width: 280,
      render: (val, row) => (
        <PopImgShow url={val}>
          <Ellipsis length={8} tooltip lines={1}>
            {row.message}
          </Ellipsis>
          <span style={{ color: '#999999' }}>{row.platformMomentId}</span>
        </PopImgShow>
      ),
    },
    {
      title: '店铺/品牌',
      dataIndex: 'relateType',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <Tag>{VIDEO_ADVERT_TYPE[val]}</Tag>
          <Ellipsis length={10} tooltip>
            {row.relateName}
          </Ellipsis>
        </div>
      ),
    },
    {
      title: '投放区域',
      align: 'right',
      dataIndex: 'areaType',
      render: (val, row) =>
        ({
          all: SHARE_AREA_TYPE[val],
          city: (
            <Tooltip title={row?.area?.split(',').map((i) => checkCityName(i))}>
              {SHARE_AREA_TYPE[val]}
            </Tooltip>
          ),
          district: (
            <Tooltip title={row?.area?.split(',').map((i) => checkCityName(i))}>
              {SHARE_AREA_TYPE[val]}
            </Tooltip>
          ),
          near: (
            <Tooltip title={`${row.beanAddress} 附近${row.area}米`}>{SHARE_AREA_TYPE[val]}</Tooltip>
          ),
        }[val]),
    },
    // {
    //   title: '观看人数',
    //   align: 'right',
    //   dataIndex: 'viewAmount',
    //   sorter: (a, b) => a.viewAmount - b.viewAmount,
    // },
    // {
    //   title: '领卡豆人数',
    //   align: 'right',
    //   dataIndex: 'personAmount',
    //   sorter: (a, b) => a.personAmount - b.personAmount,
    // },

    // {
    //   title: '累计打赏卡豆数',
    //   align: 'right',
    //   dataIndex: 'beanAmount',
    //   sorter: (a, b) => a.beanAmount - b.beanAmount,
    // },
    {
      title: '推荐位置',
      align: 'right',
      dataIndex: 'momentTagNames',
      ellipsis: true,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) =>
        `${val}\n${SUBMIT_TYPE_VIDEO[row.creatorType]} ${row.creatorName || ''}`,
    },
    {
      title: '权重',
      align: 'center',
      fixed: 'right',
      dataIndex: 'weight',
      render: (val, row) => <WeightSet detail={row}></WeightSet>,
    },
    {
      title: '状态',
      fixed: 'right',
      align: 'right',
      dataIndex: 'status',
      render: (val) => VIDEO_ADVERT_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'platformMomentId',
      width: 150,
      render: (val, record, index) => {
        const { status } = record;
        return [
          {
            type: 'info', // 详情
            click: () => fetchVideoAdvertDetail(index, 'info'),
          },
          {
            type: 'edit', // 编辑
            click: () => fetchVideoAdvertDetail(index, 'edit'),
          },
          {
            type: 'set', // 设置
            click: () => fetchGetRate({ type: 'videoAD', record }),
          },
          {
            type: 'down', // 下架
            visible: status == 1,
            click: () => fetchStatusClose(val),
          },
          {
            type: 'rewardPeo', // 打赏设置
            visible: status != 0,
            click: () =>
              setVisibleReward({ show: true, detail: { ...record, momentId: val, ownerId: -1 } }),
          },
          {
            type: 'peasDetail',
            title: '领豆明细',
            click: () => setVisiblePeas({ show: true, detail: record }),
          },
        ];
      },
    },
  ];

  // 设置
  const fetchGetRate = (payload) => {
    const { type, record = {} } = payload;
    const { platformMomentId, relateId, shareEarnFlag } = record;
    dispatch({
      type: 'videoPlatform/fetchVideoFakeList',
      payload: {
        momentId: platformMomentId,
        ownerId: relateId,
      },
      callback: (detail) => {
        const initialValues = {
          ...record,
          ...detail,
          listPayload: payload,
          momentId: platformMomentId,
          ownerId: relateId,
          shareEarnFlag: Number(shareEarnFlag),
        };
        setVisibleSet({ type, show: true, initialValues });
      },
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

  // 获取推荐位置ugc标签
  const fetchGetUgcTag = () => {
    dispatch({
      type: 'videoAdvert/fetchVideoListMomentTag',
    });
  };

  // 下架
  const fetchStatusClose = (val) => {
    dispatch({
      type: 'videoAdvert/fetchVideoAdvertStatus',
      payload: { platformMomentId: val },
      callback: childRef.current.fetchGetData,
    });
  };

  // 获取详情
  const fetchVideoAdvertDetail = (index, type) => {
    const { platformMomentId, relateId } = list[index];
    dispatch({
      type: 'videoAdvert/fetchVideoAdvertDetail',
      payload: {
        relateId,
        platformMomentId,
        type,
      },
      callback: (detail) => setVisibleDetail({ show: true, index, type, detail }),
    });
  };

  const extraBtn = [
    {
      auth: 'save',
      text: '新增',
      onClick: () => setVisible({ type: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        noCard={false}
        btnExtra={extraBtn}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.platformMomentId}`}
        dispatchType="videoAdvert/fetchGetList"
        {...videoAdvert}
      ></TableDataBlock>
      {/* 新增 */}
      <VideoSetDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></VideoSetDrawer>
      {/* 详情 修改 */}
      <VideoDetail
        visible={visibleDetail}
        childRef={childRef}
        total={list.length}
        getDetail={fetchVideoAdvertDetail}
        onClose={() => setVisibleDetail(false)}
      ></VideoDetail>
      {/* 打赏设置 */}
      <RewardSet
        type="videoAdvert"
        visible={visibleReward}
        onClose={() => setVisibleReward(false)}
      ></RewardSet>
      {/* 设置 */}
      <VideoSet
        onSubmit={fetchNewShareNoAudit}
        childRef={childRef}
        visible={visibleSet}
        fetchGetRate={fetchGetRate}
        onClose={() => setVisibleSet(false)}
      ></VideoSet>
      {/* 领豆明细 */}
      <VideoPeasDetail
        visible={visiblePeas}
        onClose={() => setVisiblePeas(false)}
      ></VideoPeasDetail>
    </>
  );
};

export default connect(({ videoAdvert, loading }) => ({
  videoAdvert,
  tagList: videoAdvert.tagList,
  loading: loading.models.videoAdvert,
}))(ShareManage);
