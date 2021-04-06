import React, { useRef } from 'react';
import { connect } from 'umi';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';

const ActiveAllocationPlace = (props) => {
  const { activeAllocationPlace, loading, userOs, promotionVersion, setVisibleSet } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '位置',
      name: 'promotionPage',
      type: 'select',
      select: { list: [{ value: 'main', name: '首页' }] },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '名称',
      dataIndex: 'promotionTypeName',
    },
    {
      title: '备注',
      dataIndex: 'promotionDesc',
    },
    {
      title: '展示位置',
      dataIndex: 'promotionImage',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '活动名称',
      dataIndex: 'promotionName',
    },
    {
      title: '跳转类型',
      dataIndex: 'jumpType',
    },
    {
      title: '跳转连接',
      dataIndex: 'jumpUrl',
      render: (val, records) =>
        ({
          h5: (
            <Ellipsis length={20} tooltip>
              {val}
            </Ellipsis>
          ),
          native: records.nativeName,
        }[records.jumpType]),
    },
    {
      title: '操作',
      dataIndex: 'promotionIdString',
      fixed: 'right',
      align: 'right',
      render: (val, records) => (
        <HandleSetTable
          formItems={[
            {
              title: '配置',
              click: () =>
                setVisibleSet({
                  show: true,
                  promotionId: val,
                  records: {
                    ...records,
                    nativeId: records.nativeIdString ? Number(records.nativeIdString) : '',
                  },
                  childRef,
                }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <TableDataBlock
      firstFetch={false}
      noCard={false}
      size="middle"
      searchItems={searchItems}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.promotionType}`}
      params={{ userOs, promotionVersion }}
      dispatchType="activeAllocationPlace/fetchGetList"
      {...activeAllocationPlace}
    ></TableDataBlock>
  );
};

export default connect(({ activeAllocationPlace, loading }) => ({
  activeAllocationPlace,
  loading: loading.effects['activeAllocationPlace/fetchGetList'],
}))(ActiveAllocationPlace);
