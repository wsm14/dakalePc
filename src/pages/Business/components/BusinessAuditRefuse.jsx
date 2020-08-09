export default (merchantName, loading) => ({
  type: 'Modal',
  loading,
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
