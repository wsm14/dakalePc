import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { SHARE_TYPE, SHARE_STATUS, BUSINESS_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import { MreSelect } from '@/components/MerchantDataTable';
import CloseRefuse from './components/Share/CloseRefuse';
import ShareDetail from './components/Share/ShareDetail';
import ShareHandleDetail from './components/Share/ShareHandleDetail';
import ShareVideoDetail from './components/Share/ShareVideoDetail';
import styles from './style.less';

const ShareManage = (props) => {
  const { shareManage, loading, tradeList, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 详情
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
      name: 'submitRefundTimeStart',
      end: 'submitRefundTimeEnd',
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
      name: 'merchantType',
      type: 'select',
      select: BUSINESS_TYPE,
    },
    {
      label: '剩余卡豆',
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
      placeholder: '选择行业',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '视频',
      fixed: 'left',
      dataIndex: 'frontImage',
      render: (val) => (
        <PopImgShow url={val} onClick={() => setVisibleVideo({ show: true, detail })}></PopImgShow>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '店铺类型',
      dataIndex: 'merchantName',
    },
    {
      title: '店铺/集团名称',
      align: 'center',
      dataIndex: 'contentType',
      render: (val) => <a onClick={() => setVisibleMre(true)}>商户</a>,
    },
    {
      title: '活动店铺数',
      align: 'right',
      dataIndex: 'beanAmount',
    },
    {
      title: '地区',
      align: 'center',
      dataIndex: 'length',
    },
    {
      title: '行业',
      align: 'center',
      dataIndex: 'viewAmount',
    },
    {
      title: '观看人数（人）',
      align: 'right',
      dataIndex: 'forwardAmount',
    },
    {
      title: '打卡人数（人）',
      align: 'right',
      dataIndex: 'payedBeanAmount',
    },
    {
      title: '单次打赏卡豆数',
      align: 'right',
      dataIndex: 'status',
      render: (val) => SHARE_STATUS[val],
    },
    {
      title: '累计打赏卡豆数',
      align: 'right',
      dataIndex: 'stastus',
    },
    {
      title: '剩余卡豆数',
      align: 'right',
      dataIndex: 'stastus',
    },
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'stastus',
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'stastus',
    },
    {
      title: '更新人',
      align: 'center',
      dataIndex: 'stastus',
    },
    {
      title: '关联券/商品',
      fixed: 'right',
      align: 'right',
      dataIndex: 'stastus',
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
      dataIndex: 'userMomentIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => {
        const { status } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'del',
                popText: `删除之后内容不可恢复，\n确认删除吗？`,
                click: () => setVisibleDown({ show: true, initialValues: record }),
              },
              {
                type: 'edit',
                click: () => fetchShareDetail(val, record.contentType),
              },
              {
                type: 'recall',
                pop: true,
                click: () => setVisibleDown({ show: true, initialValues: record }),
              },
              {
                type: 'signDetail',
                click: () => fetchShareHandleDetail(val),
              },
              {
                type: 'down',
                visible: status == 1 || status == 5,
                click: () => setVisibleDown({ show: true, initialValues: record }),
              },
              {
                type: 'info',
                click: () => fetchShareDetail(val, record.contentType),
              },
              {
                type: 'handleDeatil',
                click: () => fetchShareHandleDetail(val),
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
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowClassName={(record) => (record.bucket < 200 ? styles.share_rowColor : '')}
        rowKey={(record) => `${record.userMomentIdString}`}
        dispatchType="shareManage/fetchGetList"
        {...shareManage}
        list={[{ userMomentIdString: 1 }]}
      ></TableDataBlock>
      <ShareDetail visible={visible} onClose={() => setVisible(false)}></ShareDetail>
      <ShareVideoDetail
        visible={visibleVideo}
        onClose={() => setVisibleVideo(false)}
      ></ShareVideoDetail>
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
  loading: loading.models.shareManage,
}))(ShareManage);
