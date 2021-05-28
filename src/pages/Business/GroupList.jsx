import React, { useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { WORKER_BANK_STATUS } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import DrawerForms from './components/Group/addGroup';
import SetDetailsForms from './components/Group/activateGroup';
import TableDataBlock from '@/components/TableDataBlock';

import PopImgShow from '@/components/PopImgShow';
import GroupDetails from './components/Group/groupDetails';

const tableList = (props) => {
  const {
    dispatch,
    list,
    visible,
    visible1,
    visible2,
    tradeList,
    loading,
    // categoryDTOList
  } = props;
  useEffect(() => {
    fetchMasterTotalList();
    fetchMasterManagementList();
    fetchWMSUserRoles();
  }, []);
  const fetchMasterTotalList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };
  const fetchMasterManagementList = () => {
    dispatch({
      type: 'businessBrand/fetchGetList',
      payload: {
        page: 1,
        limit: 999,
      },
    });
  };
  const fetchWMSUserRoles = () => {
    dispatch({
      type: 'groupSet/fetchWMSUserRoles',
      payload: {
        clusterId: '0',
        ownerType: 'group',
      },
    });
  };
  const fetchSave = (payload, close) => {
    dispatch({
      type: 'groupSet/save',
      payload: close
        ? {
            visible: false,
            visible1: false,
            visible2: false,
            merchantGroupId: null,
            groupDetails: {},
            merchantGroupDTO: {},
            businessLicense: {},
            bankBindingInfo: {},
            initial: {},
          }
        : payload,
    });
  };
  const fetchGrounpDetails = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGrounpDetails',
      payload: payload,
      callback: callback,
    });
  };
  const childRef = useRef();
  const searchItems = [
    {
      label: '集团名称',
      name: 'groupName',
    },
    {
      label: '经营类目',
      name: 'categoryId',
      type: 'select',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'id' },
    },
    {
      label: '账户状态',
      name: 'bankStatus',
      type: 'select',
      select: WORKER_BANK_STATUS,
    },
  ];
  // table 表头
  const getColumns = [
    {
      title: '品牌logo',
      align: 'center',
      dataIndex: 'brandLogo',
      render: (val) => <PopImgShow url={val || ''} />,
    },
    {
      title: '集团id',
      align: 'center',
      dataIndex: 'merchantGroupId',
      render: (val) => val || '--',
    },
    {
      title: '集团名称',
      align: 'center',
      dataIndex: 'groupName',
    },
    {
      title: '经营类目',
      align: 'center',
      dataIndex: 'categoryName',
      ellipsis: true,
    },
    {
      title: '详细地址',
      align: 'center',
      dataIndex: 'address',
      render: (val) => val || '-',
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
      render: (val) => `${val}`,
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
      render: (val) => WORKER_BANK_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'merchantGroupId',
      render: (val, record, index) => [
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
          type: 'activate',
          visible: record.bankStatus === '0',
          click: () => {
            fetchSave({
              visible1: true,
              merchantGroupId: val,
              groupDetails: {},
              initial: {},
            });
          },
        },
      ],
    },
  ];
  return (
    <>
      <TableDataBlock
        keepData
        btnExtra={
          <AuthConsumer auth="save">
            <Button
              className="dkl_green_btn"
              key="1"
              onClick={() =>
                fetchSave({
                  visible: true,
                  merchantGroupId: null,
                  groupDetails: {},
                  merchantGroupDTO: {},
                  businessLicense: {},
                  bankBindingInfo: {},
                  initial: {},
                })
              }
            >
              新增
            </Button>
          </AuthConsumer>
        }
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        cRef={childRef}
        rowKey={(record) => `${record.merchantGroupId}`}
        dispatchType="groupSet/fetchGetList"
        {...list}
      ></TableDataBlock>
      <DrawerForms
        saveVisible={(res) => fetchSave(res)}
        visible={visible}
        childRef={childRef}
        onClose={() => fetchSave({}, () => {}, true)}
      ></DrawerForms>
      <SetDetailsForms
        saveVisible={(res) => fetchSave(res)}
        visible={visible1}
        childRef={childRef}
        onClose={() => fetchSave({}, () => {}, true)}
      ></SetDetailsForms>
      <GroupDetails
        saveVisible={(res) => fetchSave(res)}
        visible={visible2}
        onClose={() => fetchSave({}, () => {}, true)}
      ></GroupDetails>
    </>
  );
};
export default connect(({ sysTradeList, groupSet, loading }) => ({
  ...sysTradeList,
  ...groupSet,
  loading: loading.models.groupSet,
  tradeList: sysTradeList.list.list,
  categoryDTOList: sysTradeList.categoryDTOList,
}))(tableList);
