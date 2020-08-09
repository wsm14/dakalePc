export default (merchantName) => ({
  type: 'Modal',
  showType: 'form',
  width: 520,
  maskClosable: false,
  formItems: [
    {
      label: '抽佣比例',
      name: 'commissionRatio',
      addonAfter: '%',
      rules: [
        { pattern: /^\d+$/, message: `请输入数字` },
        { required: true, message: `请输入抽佣比例` },
      ],
    },
  ],
});
