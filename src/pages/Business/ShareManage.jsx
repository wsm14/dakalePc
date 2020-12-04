import React, { useRef } from 'react';
import { connect } from 'dva';
import { SHARE_TYPE, SHARE_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';

const ShareManage = (props) => {
  const { shareManage, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '内容标题',
      name: 'beginDate',
    },
    {
      label: '分享类型',
      type: 'select',
      name: 'contentType',
      select: { list: SHARE_TYPE },
    },
    {
      label: '分享状态',
      type: 'select',
      name: 'status',
      select: { list: SHARE_STATUS },
    },
    {
      label: '所属店铺',
      name: 'merchantName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '种草内容',
      fixed: 'left',
      dataIndex: 'frontImage',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '内容标题',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '所属店铺',
      dataIndex: 'merchantName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '分享分类',
      align: 'center',
      dataIndex: 'contentType',
      render: (val) => (val == 'video' ? '视频' : '图片'),
    },
    {
      title: '单次打赏卡豆数',
      align: 'right',
      dataIndex: 'beanAmount',
    },
    {
      title: '视频时长',
      align: 'right',
      dataIndex: 'length',
      render: (val) => (val ? `${val}s` : '--'),
    },
    {
      title: '观看人数',
      align: 'right',
      dataIndex: 'viewAmount',
    },
    {
      title: '转发数',
      align: 'right',
      dataIndex: 'forwardAmount',
    },
    {
      title: '卡豆支出',
      align: 'right',
      dataIndex: 'payedBeanAmount',
    },
    {
      title: '分享状态',
      align: 'right',
      dataIndex: 'status',
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
                type: 'own',
                pop: true,
                title: '下架',
                visible: status == 1,
                click: () => fetchGetDetail(val),
              },
              {
                type: 'info',
                click: () =>
                  fetchGetDetail(val, (info) => setVisibleEdit({ show: true, type: 'edit', info })),
              },
              {
                title: '操作记录',
                type: 'own',
                click: () => setVisible({ show: true, record }),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <DataTableBlock
      keepName="绑定查询"
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userMomentIdString}`}
      dispatchType="shareManage/fetchGetList"
      {...shareManage}
    ></DataTableBlock>
  );
};

export default connect(({ shareManage, loading }) => ({
  shareManage,
  loading: loading.models.shareManage,
}))(ShareManage);
