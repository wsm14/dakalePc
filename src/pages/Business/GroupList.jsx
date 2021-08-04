import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'umi';
import { GROUP_BANK_STATUS } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import StoreList from './components/Group/StoreList';
import GroupDetail from './components/Group/GroupDetail';

const tableList = (props) => {
  const { dispatch, list, visible2, tradeList, loading } = props;

  const childRef = useRef();
  const [storeShow, setStoreShow] = useState(false); // 门店列表展示

  useEffect(() => {
    fetchGetTrade();
  }, []);

  // 获取经营类目
  const fetchGetTrade = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  const searchItems = [
    {
      label: '集团名称',
      name: 'groupName',
    },
    {
      label: '经营类目',
      type: 'cascader',
      name: 'topCategoryId',
      changeOnSelect: true,
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      valuesKey: ['topCategoryId', 'categoryId'],
    },
    {
      label: '账户状态',
      name: 'bankStatus',
      type: 'select',
      select: GROUP_BANK_STATUS,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '集团名称/集团ID',
      dataIndex: 'groupName',
      render: (val, row) => `${val}\n${row.merchantGroupIdString || '--'}`,
    },
    {
      title: '品牌logo',
      align: 'center',
      dataIndex: 'brandLogo',
      render: (val) => <PopImgShow url={val || ''} />,
    },
    {
      title: '经营类目',
      align: 'center',
      dataIndex: 'categoryName',
    },
    {
      title: '所在地区',
      align: 'center',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '详细地址',
      align: 'center',
      ellipsis: true,
      dataIndex: 'address',
      render: (val) => val || '--',
    },
    {
      title: '联系人',
      align: 'center',
      dataIndex: 'contactPerson',
      render: (val) => val || '--',
    },
    {
      title: '联系电话',
      align: 'center',
      dataIndex: 'contactMobile',
    },
    {
      title: '服务费(%)',
      align: 'center',
      dataIndex: 'commissionRatio',
      render: (val) => val + '%',
    },
    {
      title: '账户状态',
      align: 'center',
      dataIndex: 'bankStatus',
      render: (val) => GROUP_BANK_STATUS[val],
    },
    {
      type: 'handle',
      width: 130,
      dataIndex: 'merchantGroupIdString',
      render: (val, row, index) => [
        {
          type: 'edit',
          click: () => {
            fetchGrounpDetails(
              {
                merchantGroupId: val,
              },
              (res) => {
                fetchSave({ visible: true });
              },
            );
          },
        },
        {
          type: 'info',
          click: () => {
            fetchSave({
              visible2: true,
              merchantGroupId: val,
              merchantGroupIdIndex: index,
            });
          },
        },
        {
          type: 'activate', // 激活
          visible: row.bankStatus !== '3', // 激活成功 3 不显示
          click: () => {
            fetchSave({
              visible1: true,
              merchantGroupId: val,
              groupDetails: {},
              initial: {},
            });
          },
        },
        {
          type: 'storeList', // 店铺列表
          visible: row.bankStatus === '3',
          click: () => setStoreShow({ show: true, detail: row }),
        },
      ],
    },
  ];

  //表格额外按钮
  const extraBtn = [
    {
      auth: 'save',
      onClick: () =>
        fetchSave({
          visible: true,
          merchantGroupId: null,
          groupDetails: {},
          merchantGroupDTO: {},
          businessLicense: {},
          bankBindingInfo: {},
          initial: {},
        }),
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        keepData
        btnExtra={extraBtn}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        cRef={childRef}
        rowKey={(record) => `${record.merchantGroupIdString}`}
        dispatchType="groupSet/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 集团详情 */}
      <GroupDetail
        saveVisible={(res) => fetchSave(res)}
        visible={visible2}
        onClose={() => fetchSave({}, () => {}, true)}
      ></GroupDetail>
      {/* 集团门店列表 */}
      <StoreList visible={storeShow} onClose={() => setStoreShow(false)}></StoreList>
    </>
  );
};
export default connect(({ sysTradeList, groupSet, loading }) => ({
  ...groupSet,
  loading: loading.models.groupSet,
  tradeList: sysTradeList.list.list,
}))(tableList);
