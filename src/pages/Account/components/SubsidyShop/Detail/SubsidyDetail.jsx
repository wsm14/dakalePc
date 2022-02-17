import React from 'react';
import { Modal } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import { checkCityName, getCityName } from '@/utils/utils';
import { brand } from '@/pages/Business/components/Group/Detail/detailsIndex';

const SubsidyDetail = (props) => {
  const { onClose, visible } = props;

  const { show = false, titles, checkType = '', role = '', list = [] } = visible;
  // pushVideo momentStop  "platformSubsidy" platform，directCharge
  // role :
  // (user: string;
  // merchant: string;
  // group: string;)
  // brand

  const getColumnsGroup = [
    {
      title: '集团名称',
      dataIndex: 'groupName',
      width: 280,
    },
    {
      title: '所属行业',
      align: 'center',
      dataIndex: 'topCategoryName',
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 200,
    },
    {
      title: '补贴/回收卡豆数',
      align: 'center',
      dataIndex: 'subsidyBean',
    },
  ];

  const getColumnsVideo = [
    {
      title: '品牌名',
      dataIndex: 'brandName',
      width: 280,
    },
    {
      title: '品牌类型',
      align: 'center',
      dataIndex: 'categoryName',
    },

    {
      title: '补贴/回收卡豆数',
      align: 'center',
      dataIndex: 'subsidyBean',
    },
  ];

  const getColumnsM = [
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
      width: 280,
    },
    {
      title: '店铺账号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '所属商圈',
      align: 'center',
      dataIndex: 'businessHub',
    },
    {
      title: '所属行业',
      align: 'center',
      dataIndex: 'topCategoryName',
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 200,
    },
    {
      title: '补贴/回收卡豆数',
      align: 'center',
      dataIndex: 'subsidyBean',
    },
  ];

  const getColumns = [
    {
      title: '用户ID',
      align: 'center',
      dataIndex: 'userIdString',
    },
    {
      title: '用户昵称',
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: '用户手机号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '豆号',
      align: 'center',
      dataIndex: 'beanCode',
    },
    {
      title: '级别',
      align: 'center',
      dataIndex: 'levelName',
    },
    {
      title: '注册地',
      align: 'center',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: ' 补贴/回收卡豆数',
      align: 'center',
      dataIndex: 'subsidyBean',
    },
  ];

  const getColumnsCity = [
    {
      title: '企业名称',
      align: 'center',
      dataIndex: 'companyName',
    },
    {
      title: '分管城市',
      align: 'center',
      dataIndex: 'agentCityCode',
      render: (val) => getCityName(val) || '--',
    },
    {
      title: '补贴/回收卡豆数',
      align: 'center',
      dataIndex: 'subsidyBean',
    },
  ];

  const getColumnsPartner = [
    {
      title: '企业名称',
      align: 'center',
      dataIndex: 'partnerName',
    },
    {
      title: '分管区县',
      align: 'center',
      dataIndex: 'agentDistrictCode',
      render: (val) => getCityName(val) || '--',
    },
    {
      title: '补贴/回收卡豆数',
      align: 'center',
      dataIndex: 'subsidyBean',
    },
  ];

  const modalProps = {
    title: `详情-${titles}-补贴/回收`,
    visible: show,
    width: 1200,
    onCancel: () => onClose(),
    footer: null,
  };
  // const commonType = ['platformSubsidy', 'platform', 'directCharge'].includes(checkType);
  const columns = {
    user: getColumns,
    merchant: getColumnsM,
    group: getColumnsGroup,
    brand: getColumnsVideo,
    city: getColumnsCity,
    partner: getColumnsPartner,
  }[role];

  return (
    <Modal {...modalProps}>
      <TableDataBlock
        order
        noCard={false}
        columns={role ? columns : []}
        rowKey={(record) =>
          ['brand', 'city', 'partner'].includes(role)
            ? {
                brand: `${record.id}`,
                city: `${record.cityId}`,
                partner: `${record.partnerIdString}`,
              }[role]
            : `${record.configBrandIdString}`
        }
        list={list || []}
        total={list?.length || 0}
      ></TableDataBlock>
    </Modal>
  );
};
export default SubsidyDetail;
