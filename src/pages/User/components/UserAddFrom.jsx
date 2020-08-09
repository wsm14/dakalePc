// export default DrawerForm;
export default (props) => ({
  type: 'Drawer',
  showType: 'form',
  title: '标题12',
  formItems: [
    { label: 'input', name: 'userName' },
    { label: 'select', name: 'select', type: 'select', select: ['1', 2, 3, 4] },
    { label: 'number', name: 'number', type: 'number' },
    { label: 'rangePicker', name: 'rangePicker', type: 'rangePicker' },
    { label: 'textArea', name: 'textArea', type: 'textArea' },
    { label: 'TimePicker', name: 'timePicker', type: 'timePicker' },
    { label: 'Cascader', name: 'cascader', type: 'cascader' },
    {
      label: 'Upload',
      type: 'upload',
      name: 'upload',
    },
  ],

  ...props,
});
