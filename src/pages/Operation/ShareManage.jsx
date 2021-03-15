import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { MreSelect } from '@/components/MerchantDataTable';
import { SHARE_TYPE, SHARE_STATUS, BUSINESS_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import AuthConsumer from '@/layouts/AuthConsumer';
import CloseRefuse from './components/Share/CloseRefuse';
import ShareDetail from './components/Share/ShareDetail';
import ShareHandleDetail from './components/Share/ShareHandleDetail';
import ShareVideoDetail from './components/Share/ShareVideoDetail';
import ShareDrawer from './components/Share/ShareDrawer';
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
      type: 'shareManage/fetchShareHandleDetail',
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
      title: '视频',
      fixed: 'left',
      dataIndex: 'frontImage',
      render: (val, detail) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '店铺类型',
      dataIndex: 'userType',
      render: (val) => BUSINESS_TYPE[val],
    },
    {
      title: '店铺/集团名称',
      align: 'center',
      dataIndex: 'merchantName',
      render: (val, row) =>
        row.userType === 'merchant' ? val : <a onClick={() => setVisibleMre(true)}>{val}</a>,
    },
    {
      title: '地区',
      align: 'center',
      dataIndex: 'provinceName',
      render: (val, row) => `${val || ''} ${row.cityName || ''} ${row.districtName || ''}`,
    },
    {
      title: '行业',
      align: 'center',
      dataIndex: 'topCategoryName',
      render: (val, row) => `${val}/${row.categoryName}`,
    },
    {
      title: '观看人数（人）',
      align: 'right',
      dataIndex: 'viewAmount',
    },
    {
      title: '打卡人数（人）',
      align: 'right',
      dataIndex: 'payedPersonAmount',
    },
    {
      title: '单次打赏卡豆数',
      align: 'right',
      dataIndex: 'beanAmount',
      render: (val, row) => Math.round(val + row.exposureBeanAmount),
    },
    {
      title: '累计打赏卡豆数',
      align: 'right',
      dataIndex: 'exposureBeanAmount',
      render: (val, row) => Math.round((val + row.beanAmount) * row.payedPersonAmount),
    },
    {
      title: '剩余卡豆数',
      align: 'right',
      dataIndex: 'payedPersonAmount',
      render: (val, row) =>
        Math.round((row.beanAmount + row.exposureBeanAmount) * (row.beanPersonAmount - val)),
    },
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'userMomentIdString',
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      title: '更新人',
      align: 'center',
      dataIndex: 'adminOperatorName',
    },
    {
      title: '关联券/商品',
      fixed: 'right',
      align: 'right',
      dataIndex: 'sssstastus',
    },
    {
      title: '状态',
      fixed: 'right',
      align: 'right',
      dataIndex: 'stastus',
      render: (val) => SHARE_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'length',
      fixed: 'right',
      align: 'right',
      render: (val, record) => {
        const { status, userMomentIdString } = record;
        return (
          <HandleSetTable
            formItems={[
              // 下架
              {
                type: 'down',
                visible: status == 1 || status == 5,
                click: () => setVisibleDown({ show: true, initialValues: record }),
              },
              // 详情
              {
                type: 'info',
                click: () => fetchShareDetail(userMomentIdString, record.contentType || 'video'),
              },
              // 打卡明细
              {
                type: 'signDetail',
                click: () => fetchShareHandleDetail(userMomentIdString),
              },
              // 操作记录
              {
                type: 'handleDeatil',
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
    loading.effects['shareManage/fetchShareHandleDetail'],
}))(ShareManage);
