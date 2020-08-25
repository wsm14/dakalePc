import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';

const MarketCardActivitySet = (props) => {
  const { dispatch, childRef } = props;

  // 新增活动
  const fetchMarketActivityAdd = (values) => {
    const {
      activityBeginTime: time,
      activityBanner: { fileList },
    } = values;
    const payload = {
      ...values,
      activityBeginTime: time[0].format('YYYY-MM-DD 00:00:00'),
      activityEndTime: time[1].format('YYYY-MM-DD 00:00:00'),
    };
    aliOssUpload(fileList.map((item) => item.originFileObj)).then((res) => {
      dispatch({
        type: 'marketCardActivity/fetchMarketActivityAdd',
        payload: { ...payload, activityBanner: res.toString() },
        callback: () => childRef.current.fetchGetData(),
      });
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '新增活动',
    loadingModels: 'marketCardActivity',
    formItems: [
      {
        label: '活动名称',
        name: 'activityName',
        maxLength: 20,
      },
      {
        label: '活动时间',
        type: 'rangePicker',
        name: 'activityBeginTime',
        disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
      },
      {
        label: 'banner图',
        type: 'upload',
        name: 'activityBanner',
        maxFile: 1,
      },
      {
        label: '活动链接',
        name: 'activityUrl',
        extra: '跳转进入的H5活动页面链接',
        addRules: [
          {
            type: 'url',
            message: '请输入正确链接格式',
          },
        ],
      },
      {
        type: 'textArea',
        label: '活动简述',
        name: 'description',
        maxLength: 20,
      },
      {
        label: '活动类型',
        name: 'activitySubType',
        maxLength: 20,
      },
    ],
    onFinish: fetchMarketActivityAdd,
    ...props,
  };
};

export default MarketCardActivitySet;
