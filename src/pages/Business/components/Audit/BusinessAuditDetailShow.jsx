const BusinessAuditDetailShow = (props) => {
  return {
    type: 'Drawer',
    showType: 'info',
    width: 600,
    title: '商户驳回详情',
    formItems: [
      {
        label: '商户简称',
        name: 'merchantName',
      },
      {
        label: '所在城市',
        name: 'cityName',
      },
      {
        label: '详细地址',
        name: 'address',
      },
      {
        label: '经营类目',
        name: 'topCategoryName',
        render: (val, row) => `${val} - ${row.categoryName}`,
      },
      {
        label: '平台服务费',
        name: 'commissionRatio',
        render: (val, row) => `${val}%（赠送${row.bondBean}卡豆）`,
      },
      {
        label: '申请时间',
        name: 'applyTime',
      },
      {
        label: '审核时间',
        name: 'verifyTime',
      },
      {
        label: '审核状态',
        name: 'verifyStatus',
        render: () => `审核驳回`,
      },
      {
        label: '驳回原因',
        name: 'rejectReason',
      },
    ],
    ...props,
  };
};

export default BusinessAuditDetailShow;
