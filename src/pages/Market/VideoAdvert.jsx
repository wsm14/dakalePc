import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Space } from 'antd';
import { VIDEO_NOVICE_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import VideoShowModal from './components/VideoAd/VideoShowModal';
import VideoPeasDetail from './components/VideoAd/VideoPeasDetail';
import VideoSetDrawer from './components/VideoAd/VideoSetDrawer';
import styles from './styles.less';

const VideoAdvert = (props) => {
  const { videoAdvert, loading, dispatch, tradeList } = props;

  const childRef = useRef();
  const [visibleVideo, setVisibleVideo] = useState(false); // 查看视频
  const [visiblePeas, setVisiblePeas] = useState(false); // 领豆明细
  const [visibleSet, setVisibleSet] = useState(false); // 发布

  // 表格card配置
  const cardProps = {
    tabList: [
      {
        tab: '新手视频',
        key: 'novice',
      },
    ],
    tabBarExtraContent: (
      <Space>
        <AuthConsumer auth="save">
          <Button
            className="dkl_green_btn"
            onClick={() => setVisibleSet({ type: 'add', show: true })}
          >
            新增
          </Button>
        </AuthConsumer>
      </Space>
    ),
  };

  // 搜索参数
  const searchItems = [
    {
      label: '视频标题',
      name: 'title',
    },
    {
      label: '店铺名称',
      name: 'merchantName',
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
      select: VIDEO_NOVICE_STATUS,
    },
    {
      label: '创建人',
      name: 'creatorName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '视频/标题',
      fixed: 'left',
      dataIndex: 'merchantCover',
      width: 280,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <PopImgShow
              url={val}
              onClick={() => setVisibleVideo({ show: true, detail: row })}
            ></PopImgShow>
          </div>
          <div style={{ marginLeft: '15px' }}>
            <Ellipsis length={10} tooltip lines={2}>
              {row.title}
            </Ellipsis>
          </div>
        </div>
      ),
    },
    {
      title: '关联店铺',
      width: 200,
      dataIndex: 'merchantName',
      render: (val) => (
        <Ellipsis length={10} tooltip lines={2}>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '单次打赏卡豆',
      align: 'right',
      dataIndex: 'beanAmount',
      render: (val) => `${val}卡豆/人`,
    },
    {
      title: '观看人数',
      align: 'right',
      dataIndex: 'viewAmount',
    },
    {
      title: '领卡豆人',
      align: 'right',
      dataIndex: 'getBeanPersonNum',
    },
    {
      title: '累计打赏卡豆数',
      align: 'right',
      dataIndex: 'rewardedBean',
    },
    {
      title: '卡豆余额',
      align: 'right',
      dataIndex: 'remainBean',
    },
    {
      title: '关联券/商品',
      dataIndex: 'freeCouponName',
      width: 250,
      render: (val, row) =>
        `${val}\n${row.valuableCouponName || row.specialGoodsName || ''}\n（${row.stock}）`,
    },
    {
      title: '发布时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.creatorName || ''}`,
    },
    {
      title: '状态',
      align: 'center',
      fixed: 'right',
      dataIndex: 'status',
      render: (val) => VIDEO_NOVICE_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'guideMomentsId',
      align: 'right',
      fixed: 'right',
      width: 165,
      render: (guideMomentsId, row) => {
        const { status } = row;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'info',
                click: () => fetchVideoAdNoviceDetail({ guideMomentsId }, 'info'),
              },
              {
                type: 'down',
                visible: status === '1',
                click: () => fetchOpenAdvertStatus({ appLaunchImageId, onFlag: 0 }),
              },
              {
                type: 'again',
                visible: status === '3',
                click: () => fetchOpenAdvertStatus({ appLaunchImageId, onFlag: 0 }),
              },
              {
                type: 'peasDetail',
                title: '领豆明细',
                click: () => fetchOpenAdvertStatus({ appLaunchImageId, onFlag: 0 }),
              },
              {
                type: 'diary',
                click: () => fetchOpenAdvertStatus({ appLaunchImageId, deleteFlag: 0 }),
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

  // 获取详情
  const fetchVideoAdNoviceDetail = (payload, type) => {
    dispatch({
      type: 'videoAdvert/fetchVideoAdNoviceDetail',
      payload,
      callback: (detail) => setVisibleSet({ show: true, type, detail }),
    });
  };

  // 下架 删除
  const fetchOpenAdvertStatus = (payload) => {
    dispatch({
      type: 'openAdvert/fetchOpenAdvertStatus',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        cardProps={cardProps}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.guideMomentsId}`}
        rowClassName={(record) => (record.stock <= 10 ? styles.video_rowColor : '')}
        dispatchType="videoAdvert/fetchGetList"
        {...videoAdvert}
      ></TableDataBlock>
      {/* 领豆明细 */}
      <VideoPeasDetail
        visible={visiblePeas}
        onClose={() => setVisiblePeas(false)}
      ></VideoPeasDetail>
      {/* 点击图片查看视频 */}
      <VideoShowModal
        visible={visibleVideo}
        onClose={() => setVisibleVideo(false)}
      ></VideoShowModal>
      {/* 发布 / 详情 */}
      <VideoSetDrawer visible={visibleSet} onClose={() => setVisibleSet(false)}></VideoSetDrawer>
    </>
  );
};

export default connect(({ videoAdvert, sysTradeList, loading }) => ({
  videoAdvert,
  tradeList: sysTradeList.list.list,
  loading: loading.models.videoAdvert,
}))(VideoAdvert);
