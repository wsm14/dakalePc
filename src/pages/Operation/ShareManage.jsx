import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { MreSelect } from '@/components/MerchantDataTable';
import { SHARE_TYPE, SHARE_STATUS, BUSINESS_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import QuestionTooltip from '@/components/QuestionTooltip';
import CloseRefuse from './components/Share/CloseRefuse';
import ShareDetail from './components/Share/ShareDetail';
import ShareHandleDetail from './components/Share/ShareHandleDetail';
import ShareVideoDetail from './components/Share/ShareVideoDetail';
import ShareDrawer from './components/Share/ShareDrawer';
import Ellipsis from '@/components/Ellipsis';
import styles from './style.less';

const ShareManage = (props) => {
  const { shareManage, loading, tradeList, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 详情
  const [visibleShare, setVisibleShare] = useState(false); // 发布分享
  const [visibleMre, setVisibleMre] = useState(false); // 商户详情
  const [visibleVideo, setVisibleVideo] = useState(false); // 视屏
  const [visibleDown, setVisibleDown] = useState(false); // 下架原因
  const [visibleHandle, setVisibleHandle] = useState(false); // 操作记录

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
  const fetchShareDetail = (val, type) => {
    dispatch({
      type: 'shareManage/fetchShareDetail',
      payload: {
        userMomentIdString: val,
      },
      callback: (detail) => setVisible({ show: true, type, detail }),
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

  // 搜索参数
  const searchItems = [
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
      label: '分享标题',
      name: 'title',
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
      label: '集团/店铺名称',
      name: 'merchantName',
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
      placeholder: '选择行业',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '视频/标题',
      fixed: 'left',
      dataIndex: 'frontImage',
      render: (val, detail) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PopImgShow url={val}></PopImgShow>
          <Ellipsis style={{ marginLeft: '15px' }} length={10} tooltip>
            {detail.title}
          </Ellipsis>
        </div>
      ),
    },
    {
      title: '店铺/集团',
      dataIndex: 'userType',
      width: 300,
      render: (val, row) => (
        <>
          <div className={styles.item}>
            <span
              className={styles.sp_span}
              style={{
                border: '1px solid #CDC9C9',
                background: '#FAFAFA',
                color: '#666',
              }}
            >
              {BUSINESS_TYPE[val]}
            </span>
            <Ellipsis length={10} tooltip>
              {row.merchantName}
            </Ellipsis>
          </div>
          <div>
            <span
              className={styles.sp_span}
              style={{
                border: '1px solid #FA8072',
                background: '#FFF0F5',
                color: '#FA8072',
              }}
            >{`${row.topCategoryName}-${row.categoryName}`}</span>
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
      sorter: (a, b) => a.beanAmount - b.beanAmount,
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
      dataIndex: 'goodsOrCouponName',
    },
    {
      title: '发布时间',
      align: 'center',
      dataIndex: 'createTime',
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
      width: 100,
      fixed: 'right',
      align: 'right',
      render: (val, record) => {
        const { status, userMomentIdString } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'down', // 下架
                visible: status == 1 || status == 5,
                click: () => setVisibleDown({ show: true, initialValues: record }),
              },
              {
                type: 'info', // 详情
                click: () => fetchShareDetail(userMomentIdString, record.contentType || 'video'),
              },
              {
                type: 'handleDeatil', // 操作记录
                click: () => fetchShareHandleDetail(userMomentIdString),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        keepData
        // btnExtra={
        //   <AuthConsumer auth="save">
        //     <Button
        //       className="dkl_green_btn"
        //       onClick={() => setVisibleShare({ type: 'add', show: true })}
        //     >
        //       新增
        //     </Button>
        //   </AuthConsumer>
        // }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowClassName={(record) => (record.bucket < 200 ? styles.share_rowColor : '')}
        rowKey={(record) => `${record.userMomentIdString}`}
        dispatchType="shareManage/fetchGetList"
        {...shareManage}
      ></TableDataBlock>
      {/* 发布分享 */}
      <ShareDrawer visible={visibleShare} onClose={() => setVisibleShare(false)}></ShareDrawer>
      {/* 详情 */}
      <ShareDetail visible={visible} onClose={() => setVisible(false)}></ShareDetail>
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
      <CloseRefuse
        visible={visibleDown}
        childRef={childRef}
        onClose={() => setVisibleDown(false)}
      ></CloseRefuse>
      {/* 查看商户 */}
      <MreSelect type="show" visible={visibleMre} onCancel={() => setVisibleMre(false)}></MreSelect>
    </>
  );
};

export default connect(({ sysTradeList, shareManage, loading }) => ({
  shareManage,
  tradeList: sysTradeList.list.list,
  loading:
    loading.effects['shareManage/fetchGetList'] ||
    loading.effects['shareManage/fetchShareDetail'] ||
    loading.effects['baseData/fetchHandleDetail'],
}))(ShareManage);
