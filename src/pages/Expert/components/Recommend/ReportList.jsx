import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { SHARE_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import PocessReport from './ProcessReport';

const ReportList = (props) => {
  const {
    expertRecommend,
    dispatch,
    loading,
    visible = false,
    setVisible,
    fetchExpertCountReport,
  } = props;

  const statusArr = ['处理中', '已解决'];

  const [visibleSet, setVisibleSet] = useState(false);

  const childRef = useRef();

  // 搜索参数
  const propItem = {
    title: `举报中心`,
    dispatchType: 'expertRecommend/fetchGetReportList',
    rowKey: 'userReportId',
    searchItems: [
      {
        label: '类型',
        name: 'contentType',
        type: 'select',
        select: SHARE_TYPE,
      },
      {
        label: '标题',
        name: 'title',
      },
      {
        label: '手机号',
        name: 'mobile',
      },
      {
        label: '昵称',
        name: 'username',
      },
      {
        label: '状态',
        name: 'status',
        type: 'select',
        select: statusArr,
      },
    ],
    getColumns: [
      {
        title: '封面',
        dataIndex: 'frontImage',
        render: (val) => <PopImgShow url={val}></PopImgShow>,
      },
      {
        title: '类型',
        dataIndex: 'contentType',
        render: (val) => (val == 'video' ? '视频' : '图片'),
      },
      {
        title: '举报理由',
        dataIndex: 'reportReason',
        width: 150,
      },
      {
        title: '哒人昵称',
        dataIndex: 'username',
        render: (val) => (
          <Ellipsis length={5} tooltip>
            {val}
          </Ellipsis>
        ),
      },
      {
        title: '哒人等级',
        align: 'center',
        dataIndex: 'level',
      },
      {
        title: '哒人手机',
        dataIndex: 'mobile',
      },
      {
        title: '举报人',
        dataIndex: 'complainant',
        render: (val) => (
          <Ellipsis length={5} tooltip>
            {val}
          </Ellipsis>
        ),
      },
      {
        title: '举报人手机',
        dataIndex: 'complainantMobile',
        render: (val) => val || '--',
      },
      {
        title: '处理状态',
        dataIndex: 'status',
        render: (val) => statusArr[val],
      },
      {
        title: '处理结果说明',
        dataIndex: 'processResult',
        render: (val) => val || '--',
      },
      {
        title: '举报时间',
        align: 'center',
        dataIndex: 'createTime',
        render: (val) => val || 0,
      },
      {
        title: '处理时间',
        align: 'center',
        dataIndex: 'processTime',
      },
      {
        title: '操作',
        fixed: 'right',
        align: 'right',
        dataIndex: 'userReportId',
        render: (userReportId, record) => {
          const { status } = record;
          return (
            <HandleSetTable
              formItems={[
                {
                  title: '处理',
                  type: 'own',
                  auth: 'handle',
                  visible: status == 0,
                  click: () => fetchExpertProcessReport({ userReportId }),
                },
              ]}
            />
          );
        },
      },
    ],
  };

  // 处理举报
  const fetchExpertProcessReport = (initialValues) => {
    setVisibleSet({
      show: true,
      initialValues,
      fetchExpertCountReport,
    });
  };

  const tableProps = {
    noCard: false,
    loading,
    cRef: childRef,
    columns: propItem.getColumns,
    searchItems: propItem.searchItems,
    dispatchType: propItem.dispatchType,
    componentSize: 'middle',
    ...expertRecommend.reportList,
  };

  return (
    <Modal
      title={'举报中心'}
      width={1300}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible(false)}
    >
      <TableDataBlock {...tableProps} rowKey={(row) => `${row[propItem.rowKey]}`} />
      <PocessReport
        visible={visibleSet}
        childRef={childRef}
        onClose={() => setVisibleSet(false)}
      ></PocessReport>
    </Modal>
  );
};

export default connect(({ expertRecommend, loading }) => ({
  expertRecommend,
  loading: loading.effects['expertRecommend/fetchGetReportList'],
}))(ReportList);
