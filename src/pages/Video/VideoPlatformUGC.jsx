import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tag, Form } from 'antd';
import { checkCityName } from '@/utils/utils';
import { NEW_SHARE_STATUS, SUBMIT_TYPE_VIDEO, NEW_SHARE_OWNER } from '@/common/constant';
import { NUM_PATTERN } from '@/common/regExp';
import { RefuseModal } from '@/components/PublicComponents';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import QuestionTooltip from '@/components/QuestionTooltip';
import VideoSet from './components/VideoPlatform/VideoSet';
import RewarInfo from './components/VideoPlatform/RewardSet/RewarInfo';
import ShareWeightSet from './components/VideoPlatform/ShareWeightSet';
import ShareDetail from './components/VideoPlatform/Detail/ShareDetail';

const VideoPlatformUGC = (props) => {
  const { loading, loadingTab, loadingRefuse, dispatch, tabs, UGCList } = props;
  const { list } = UGCList;

  const childRef = useRef();
  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState(null); // tab
  const [visible, setVisible] = useState(false); // 详情+分享配置
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 下架原因
  const [visibleSet, setVisibleSet] = useState(false); // 设置
  const [visibleReward, setVisibleReward] = useState(false); // 打赏明细

  // tab列表
  const tabList = tabs;

  useEffect(() => {
    fetchTabList();
  }, []);

  useEffect(() => {
    tabKey &&
      childRef.current.fetchGetData({
        pickUpOrUgcFlag: 'UGC',
        momentTagId: tabKey,
      });
  }, [tabKey]);

  // 搜索参数
  const searchItems = [
    {
      label: '分享内容',
      name: 'message',
    },
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '哒人昵称',
      name: 'ownerId',
      type: 'user',
    },
    {
      label: '视频ID',
      name: 'momentId',
      rules: [{ pattern: NUM_PATTERN, message: '请输入数字' }],
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
      title: '视频/内容详情',
      fixed: 'left',
      dataIndex: 'frontImage',
      width: 280,
      render: (val, row) => (
        <PopImgShow url={val}>
          <Ellipsis length={8} tooltip lines={1}>
            {row.message}
          </Ellipsis>
          <span style={{ color: '#999999' }}>{row.momentId}</span>
        </PopImgShow>
      ),
    },
    {
      title: '发布人',
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
            <span>{checkCityName(row.districtCode)}</span>
          </div>
        </>
      ),
    },
    // {
    //   title: '观看人数',
    //   align: 'right',
    //   dataIndex: 'viewAmount',
    //   sorter: (a, b) => a.viewAmount - b.viewAmount,
    // },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) =>
        `${val}\n${SUBMIT_TYPE_VIDEO[row.creatorType]} ${row.creatorName || ''}`,
    },
    {
      title: <QuestionTooltip type="quest" title="权重" content="数值越大越靠前"></QuestionTooltip>,
      align: 'center',
      fixed: 'right',
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
            click: () => fetchShareDetail(index, 'info', 'ugc'),
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
            type: 'set', // 设置
            click: () => fetchGetRate({ type: 'ugc', record }),
          },
          {
            type: 'rewardInfo', // 打赏明细 已打赏显示按钮 未打赏只有下架状态不显示按钮
            click: () => setVisibleReward({ show: true, detail: record }),
          },
          // {
          //   title: '分享配置',
          //   type: 'shareImg',
          //   click: () => fetchShareDetail(index, 'share'),
          // },
        ];
      },
    },
  ];

  // 设置
  const fetchGetRate = (payload) => {
    const { type, record = {} } = payload;
    const { momentId, ownerId } = record;
    dispatch({
      type: 'videoPlatform/fetchVideoFakeList',
      payload: {
        momentId,
        ownerId,
      },
      callback: (detail) => {
        const initialValues = {
          ...record,
          ...detail,
          listPayload: payload,
          tagsId: tabKey,
        };
        setVisibleSet({ type, show: true, initialValues });
      },
    });
  };

  //  获取tab页列表
  const fetchTabList = () => {
    dispatch({
      type: 'videoAdvert/fetchVideoListMomentTag',
      callback: setTabKey,
    });
  };

  // 下架
  const fetchStatusClose = (values) => {
    const { momentId, ownerId } = visibleRefuse.detail;
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
  const fetchShareDetail = (index, type, momentType) => {
    const { momentId, ownerId } = list[index];
    dispatch({
      type: 'videoPlatform/fetchNewShareDetail',
      payload: {
        momentId,
        ownerId,
        type,
        momentType,
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

  return (
    <>
      <TableDataBlock
        firstFetch={false}
        searchForm={form}
        cardProps={{
          tabList: tabList,
          loading: loadingTab,
          activeTabKey: tabKey,
          onTabChange: (key) => {
            form.resetFields();
            setTabKey(key);
          },
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.momentId}`}
        params={{
          pickUpOrUgcFlag: 'UGC',
          momentTagId: tabKey,
        }}
        dispatchType="videoPlatform/fetchUGCVideoList"
        {...UGCList}
      ></TableDataBlock>

      {/* 详情 修改 编辑画像 带货设置 分享配置*/}
      <ShareDetail
        childRef={childRef}
        tabKey={tabKey}
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
      {/* 设置 */}
      <VideoSet
        tabList={tabList}
        onSubmit={fetchNewShareNoAudit}
        childRef={childRef}
        visible={visibleSet}
        fetchGetRate={fetchGetRate}
        onClose={() => setVisibleSet(false)}
      ></VideoSet>
      {/* 打赏明细 */}
      <RewarInfo visible={visibleReward} onClose={() => setVisibleReward(false)}></RewarInfo>
    </>
  );
};

export default connect(({ videoAdvert, videoPlatform, loading }) => ({
  UGCList: videoPlatform.UGCList,
  tabs: videoAdvert.tabs,
  loadingTab: loading.effects['videoAdvert/fetchVideoListMomentTag'],
  loadingRefuse: loading.effects['videoPlatform/fetchNewShareClose'],
  loading:
    loading.effects['videoPlatform/fetchUGCVideoList'] ||
    loading.effects['videoPlatform/fetchNewShareDetail'],
}))(VideoPlatformUGC);
