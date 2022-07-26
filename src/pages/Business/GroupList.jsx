import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'umi';
import { GROUP_BANK_STATUS } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import StoreList from './components/Group/StoreList';
import GroupEdit from './components/Group/GroupEdit';
import GroupActivate from './components/Group/GroupActivate';
import GroupDetail from './components/Group/GroupDetail';
import ReteDrawerSet from './components/RateDrawerSet';

const tableList = (props) => {
  const { dispatch, list, tradeList, loading } = props;

  const childRef = useRef();
  const [storeShow, setStoreShow] = useState(false); // 门店列表展示
  const [visible, setVisible] = useState({ show: false, detail: {} }); // 详情
  const [visibleActivate, setVisibleActivate] = useState({ show: false, detail: {} }); // 激活
  const [visibleEdit, setVisibleEdit] = useState({ show: false, type: 'add', detail: {} }); // 新增编辑
  const [visibleRate, setVisibleRate] = useState(false); //费率

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
      dataIndex: 'topCategoryName',
      render: (val, row) => `${val}/${row.categoryName}`,
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
          click: () => fetchGrounpDetails(index, (res) => handleEditShow('edit', res)),
        },
        {
          type: 'info',
          click: () =>
            fetchGrounpDetails(index, (info) => setVisible({ show: true, index, detail: info })),
        },
        {
          type: 'activate', // 激活
          visible: row.bankStatus !== '3', // 激活成功 3 不显示
          click: () => fetchGrounpDetails(index, handleActivateShow),
        },
        {
          type: 'storeList', // 店铺列表
          visible: row.bankStatus === '3',
          click: () => setStoreShow({ show: true, detail: row }),
        },
        {
          type: 'rate',
          title: '费率',
          click: () => fetchGetRate({ type: 'group', row }),
          visible: row.bankStatus === '3',
        },
      ],
    },
  ];

  // 费率
  const fetchGetRate = (payload) => {
    const { type, row = {} } = payload;
    const { merchantGroupIdString: ownerId } = row;
    // setVisibleRate({ type, show: true, initialValues: { ...record } });
    dispatch({
      type: 'businessList/fetchAllOwnerRate',
      payload: {
        ownerType: type,
        ownerId,
      },
      callback: (detail) => {
        const initialValues = { ...row, ...detail, listPayload: payload };
        setVisibleRate({ type, show: true, initialValues });
      },
    });
  };

  // 新增修改打开
  const handleEditShow = (type, detail = {}) => setVisibleEdit({ show: true, type, detail });

  // 激活打开
  const handleActivateShow = (detail = {}) => setVisibleActivate({ show: true, detail });

  // 获取集团详情
  const fetchGrounpDetails = (index, callback) => {
    const { merchantGroupIdString: merchantGroupId } = list.list[index];
    dispatch({
      type: 'groupSet/fetchGrounpDetails',
      payload: { merchantGroupId },
      callback: (info) => {
        setVisible({ ...visible, index }); // 详情下一条储存 其它组件不影响
        callback(info);
      },
    });
  };

  //表格额外按钮
  const extraBtn = [
    {
      auth: 'save',
      onClick: () => handleEditShow('add'),
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        loading={loading}
        btnExtra={extraBtn}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.merchantGroupIdString}`}
        dispatchType="groupSet/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 新增/编辑/集团 */}
      <GroupEdit
        cRef={childRef}
        visible={visibleEdit}
        handleActivateShow={handleActivateShow} // 去激活
        onClose={() => setVisibleEdit({ show: false, detail: {} })}
      ></GroupEdit>
      {/* 激活 */}
      <GroupActivate
        cRef={childRef}
        visible={visibleActivate}
        onClose={() => setVisibleActivate({ show: false, detail: {} })}
      ></GroupActivate>
      {/* 集团详情 */}
      <GroupDetail
        visible={visible}
        fetchGrounpDetails={fetchGrounpDetails}
        handleEditShow={(res) => handleEditShow('edit', res)} // 去修改
        onClose={() => setVisible({ show: false, detail: {} })}
      ></GroupDetail>
      {/* 集团门店列表 */}
      <StoreList
        cRef={childRef}
        visible={storeShow}
        onClose={() => setStoreShow(false)}
      ></StoreList>
      {/* 费率设置 */}
      <ReteDrawerSet
        visible={visibleRate}
        fetchGetRate={fetchGetRate}
        onClose={() => setVisibleRate(false)}
      ></ReteDrawerSet>
    </>
  );
};
export default connect(({ sysTradeList, groupSet, loading }) => ({
  ...groupSet,
  loading: loading.models.groupSet,
  tradeList: sysTradeList.list.list,
}))(tableList);
