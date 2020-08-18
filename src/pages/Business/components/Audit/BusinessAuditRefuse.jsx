export default (merchantName) => ({
  type: 'Modal',
  showType: 'form',
  width: 520,
  maskClosable: false,
  formItems: [
    {
      label: '驳回原因',
      name: 'rejectReason',
      type: 'textArea',
    },
  ],
});
