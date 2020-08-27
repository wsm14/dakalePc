import aliOssUpload from '@/utils/aliOssUpload';

const CheckInDetailSet = (props) => {
  const { dispatch, childRef, CeditType, configMarkId, initialValues = {} } = props;

  const fetchSysCheckIn = (values) => {
    const { content } = values;
    const payload = {
      true: { type: 'sysCheckIn/fetchCheckInTextImgAdd' },
      false: { type: 'sysCheckIn/fetchCheckInTextImgEdit' },
    }[!Object.keys(initialValues).length];

    const defineDate = {
      ...initialValues,
      type: CeditType,
      configMarkId,
    };

    if (typeof content === 'string') {
      dispatch({
        type: payload.type,
        payload: { ...defineDate, ...values },
        callback: () => childRef.current.fetchGetData(),
      });
    } else {
      aliOssUpload(content.fileList.map((item) => item.originFileObj)).then((res) => {
        dispatch({
          type: payload.type,
          payload: { ...defineDate, content: res.toString() },
          callback: () => childRef.current.fetchGetData(),
        });
      });
    }
  };

  const formItem = {
    words: {
      title: '分享文案编辑',
      formItems: [
        {
          label: '文案',
          name: 'content',
          type: 'textArea',
        },
      ],
    },
    image: {
      title: '分享图片编辑',
      formItems: [
        {
          label: '图片上传',
          name: 'content',
          type: 'upload',
          maxFile: 1,
        },
      ],
    },
  }[CeditType];

  return {
    type: 'Drawer',
    showType: 'form',
    loadingModels: 'sysCheckIn',
    ...formItem,
    onFinish: fetchSysCheckIn,
    ...props,
  };
};

export default CheckInDetailSet;
