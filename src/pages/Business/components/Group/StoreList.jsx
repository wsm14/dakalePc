import React from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import { BUSINESS_DO_STATUS, BUSINESS_STATUS } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';

/**
 * 门店列表
 */
const StoreList = (props) => {
  const { storeList, loading, visible = {}, onClose } = props;

  const { show = false, detail = {} } = visible;

  const { groupName, merchantGroupIdString: merchantGroupId } = detail;

  const searchItems = [
    {
      label: '店铺名称',
      name: 'name',
    },
    {
      label: '店铺帐号',
      name: 'account',
    },
  ];

  const getColumns = [
    {
      title: '店铺',
      fixed: 'left',
      dataIndex: 'headerContentObject',
      width: 350,
      render: (val, row) => (
        <PopImgShow url={val.imageUrl}>
          <Ellipsis tooltip lines={2}>
            {row.merchantName}
          </Ellipsis>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 5, color: '#888888' }}>
            <Ellipsis length={15} tooltip>
              {row.account}
            </Ellipsis>
          </div>
        </PopImgShow>
      ),
    },
    {
      title: '商圈/地址',
      dataIndex: 'businessHub',
      render: (val, row) => (
        <div>
          {val}
          <div style={{ fontSize: 13 }}>
            {checkCityName(row.districtCode)}
            <div style={{ color: '#888888' }}>
              <Ellipsis length={20} tooltip>
                {row.address}
              </Ellipsis>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '入驻/激活时间',
      align: 'center',
      dataIndex: 'settleTime',
      render: (val, row) => `${val || '--'}\n${row.activationTime || '--'}`,
    },
    {
      title: '联系人',
      align: 'right',
      dataIndex: 'withholdingTax',
      render: (val) => `￥ ${val || 0}`,
    },
    {
      title: '状态',
      fixed: 'right',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) =>
        `${row.bankStatus === '3' ? '已激活' : '未激活'}\n${
          BUSINESS_DO_STATUS[row.businessStatus]
        }\n${BUSINESS_STATUS[val]}`,
    },
  ];

  return (
    <Modal
      title={`门店列表 - ${groupName}`}
      width={1300}
      destroyOnClose
      footer={null}
      visible={show}
      onCancel={onClose}
    >
      <TableDataBlock
        noCard={false}
        size="middle"
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.merchantId}`}
        params={{ groupId: merchantGroupId }}
        pagination={false}
        dispatchType="groupSet/fetchGroupStoreList"
        {...storeList}
      />
    </Modal>
  );
};

export default connect(({ groupSet, loading }) => ({
  storeList: groupSet.storeList,
  loading: loading.effects['groupSet/fetchGroupStoreList'],
}))(StoreList);
