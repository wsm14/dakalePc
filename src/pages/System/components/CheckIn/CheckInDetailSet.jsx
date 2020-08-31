import aliOssUpload from '@/utils/aliOssUpload';

const CheckInDetailSet = (props) => {
  const { dispatch, childRef, CeditType, configMarkId, initialValues = {} } = props;

  const fetchSysCheckIn = (values) => {
    const defineSet = {
      type: {
        true: 'sysCheckIn/fetchCheckInTextImgAdd',
        false: 'sysCheckIn/fetchCheckInTextImgEdit',
      }[!Object.keys(initialValues).length],
      callback: () => childRef.current.fetchGetData(),
    };

    const defineDate = {
      ...initialValues,
      type: CeditType,
      configMarkId,
    };
    const { content } = values;
    aliOssUpload(content).then((res) => {
      dispatch({
        ...defineSet,
        payload: { ...defineDate, content: res.toString() },
      });
    });
    // }
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
          maxFile: 3,
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
