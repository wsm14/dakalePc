import { BUSINESS_DO_STATUS, BUSINESS_STATUS } from '@/common/constant';

// 导出列表
export default {
  fieldNames: { key: 'key', headerName: 'header' },
  header: [
    { key: 'account', header: '店铺账号' },
    { key: 'merchantName', header: '店铺名称' },
    { key: 'provinceName', header: '所在省' },
    { key: 'cityName', header: '所在市' },
    { key: 'districtName', header: '所在区' },
    { key: 'businessHub', header: '所属商圈' },
    { key: 'address', header: '详细地址' },
    { key: 'topCategoryName', header: '一级经营类目' },
    { key: 'categoryName', header: '二级经营类目' },
    { key: 'businessArea', header: '经营面积' },
    { key: 'commissionRatio', header: '服务费', render: (val) => (val ? `${val}%` : '') },
    { key: 'settleTime', header: '入驻时间' },
    { key: 'activationTime', header: '激活时间' },
    {
      key: 'bankStatus',
      header: '账号状态',
      render: (val) => (val === '3' ? '已激活' : '未激活'),
    },
    { key: 'businessStatus', header: '经营状态', render: (val) => BUSINESS_DO_STATUS[val] },
    { key: 'status', header: '店铺状态', render: (val) => BUSINESS_STATUS[val] },
  ],
};
