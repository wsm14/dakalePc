import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tag, Form } from 'antd';
import { checkCityName } from '@/utils/utils';
import {
  NEW_SHARE_STATUS,
  SUBMIT_TYPE_VIDEO,
  NEW_SHARE_OWNER,
  BEANFLAG_TYPE,
} from '@/common/constant';
import { NUM_PATTERN } from '@/common/regExp';
import { RefuseModal } from '@/components/PublicComponents';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import QuestionTooltip from '@/components/QuestionTooltip';
import VideoSet from './components/VideoPlatform/VideoSet';
import RewardSet from './components/VideoPlatform/RewardSet';
import VideoPlatformDrawer from './components/VideoPlatform/VideoPlatformDrawer';
import ShareWeightSet from './components/VideoPlatform/ShareWeightSet';
import ShareDetail from './components/VideoPlatform/Detail/ShareDetail';
import VideoPeasDetail from './components/VideoPlatform/Detail/VideoPeasDetail';

const tabList = [
  {
    key: '0',
    tab: '探店视频',
  },
  {
    key: '1',
    tab: '带货视频',
  },
];

const VideoPlatform = (props) => {
  const { videoPlatform, loading, loadingRefuse, tradeList, dispatch } = props;
  const { list } = videoPlatform;

  const childRef = useRef();
  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState('0'); // tab
  const [visible, setVisible] = useState(false); // 详情+分享配置
  const [visibleShare, setVisibleShare] = useState(false); // 新增
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 下架原因
  const [visibleSet, setVisibleSet] = useState(false); // 设置
  const [visibleReward, setVisibleReward] = useState(false); // 打赏设置
  const [visiblePeas, setVisiblePeas] = useState(false); // 领豆明细
  // const [visibleShareEdit, setVisibleShareEdit] = useState(false); // 分享配置

  useEffect(() => {
    childRef.current &&
      childRef.current.fetchGetData({ pickUpOrUgcFlag: 'pickUp', isCommerceFlag: tabKey });
  }, [tabKey]);

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '分享内容',
      name: 'message',
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
      label: '店铺/视频类型',
      name: 'ownerType',
      type: 'select',
      select: NEW_SHARE_OWNER,
    },
    {
      label: '是否已打赏',
      name: 'beanFlag',
      type: 'select',
      select: BEANFLAG_TYPE,
    },
    // {
    //   label: '哒人昵称',
    //   name: 'ownerId',
    //   type: 'user',
    // },
    {
      label: '视频ID',
      name: 'momentId',
      rules: [{ pattern: NUM_PATTERN, message: '请输入数字' }],
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
    // {
    //   title: '观看人数',
    //   align: 'right',
    //   dataIndex: 'viewAmount',
    //   sorter: (a, b) => a.viewAmount - b.viewAmount,
    // },
    // {
    //   title: '领豆人次',
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
            click: () => fetchShareDetail(index, 'info'),
          },
          {
            type: 'information', // 数据
            click: () => fetchShareDetail(index, 'information'),
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
            visible: typeUser,
            click: () => fetchShareDetail(index, 'edit'),
          },
          {
            type: 'rewardPeo', // 打赏设置 已打赏显示按钮 未打赏只有下架状态不显示按钮
            visible: (status != 0 || tabKey === '1') && typeUser,
            click: () => setVisibleReward({ show: true, detail: record }),
          },
          // {
          //   type: 'set', // 设置
          //   click: () => setVisibleImg({ show: true, detail: record }),
          // },
          {
            type: 'set', // 设置
            click: () => fetchGetRate({ type: 'merchant', record }),
          },
          {
            type: 'commerceSet', // 带货设置
            visible: status != 0 && typeUser,
            click: () => fetchShareDetail(index, 'commerce'),
          },
          {
            type: 'portraitEdit', // 编辑画像
            visible: typeUser,
            click: () => fetchShareDetail(index, 'portrait'),
          },
          {
            type: 'peasDetail',
            title: '领豆明细',
            click: () => setVisiblePeas({ show: true, detail: record }),
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
    const { momentId, ownerId, shareEarnFlag } = record;
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
          shareEarnFlag: Number(shareEarnFlag),
          listPayload: payload,
        };
        setVisibleSet({ type, show: true, initialValues });
      },
    });
  };

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
      type:
        type == 'information'
          ? 'videoPlatform/fetchNewShareStatisticsList'
          : 'videoPlatform/fetchNewShareDetail',
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

  const extraBtn = [
    {
      auth: 'save',
      text: '新增',
      // show: tabKey === '0',
      onClick: () => setVisibleShare({ tabtype: tabKey, show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        firstFetch={false}
        //
        searchForm={form}
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: (key) => {
            form.resetFields();
            setTabKey(key);
          },
        }}
        btnExtra={extraBtn}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.momentId}`}
        params={{
          pickUpOrUgcFlag: 'pickUp',
          isCommerceFlag: tabKey,
        }}
        dispatchType="videoPlatform/fetchMerchVideoList"
        {...videoPlatform}
      ></TableDataBlock>
      {/* 新增 */}
      <VideoPlatformDrawer
        childRef={childRef}
        visible={visibleShare}
        onClose={() => setVisibleShare(false)}
      ></VideoPlatformDrawer>
      {/* 详情 数据统计 修改 编辑画像 带货设置 分享配置*/}
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
        onSubmit={fetchNewShareNoAudit}
        childRef={childRef}
        visible={visibleSet}
        fetchGetRate={fetchGetRate}
        onClose={() => setVisibleSet(false)}
      ></VideoSet>
      {/* 打赏设置 */}
      <RewardSet visible={visibleReward} onClose={() => setVisibleReward(false)}></RewardSet>
      {/* 领豆明细 */}
      <VideoPeasDetail
        visible={visiblePeas}
        onClose={() => setVisiblePeas(false)}
      ></VideoPeasDetail>
    </>
  );
};

export default connect(({ sysTradeList, videoPlatform, loading }) => ({
  videoPlatform: videoPlatform.list,
  tradeList: sysTradeList.list.list,
  loadingRefuse: loading.effects['videoPlatform/fetchNewShareClose'],
  loading:
    loading.effects['videoPlatform/fetchMerchVideoList'] ||
    loading.effects['videoPlatform/fetchNewShareDetail'],
}))(VideoPlatform);
