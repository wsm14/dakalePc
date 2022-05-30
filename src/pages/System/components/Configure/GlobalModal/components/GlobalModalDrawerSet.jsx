import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import moment from 'moment';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';
import { MODAL_FREQUENCY, MARKET_LOOK_AREA, MARKET_MODAL_TYPE } from '@/common/constant';
import { NewNativeFormSet } from '@/components/FormListCondition';
import { GLOBAL_MODAL_IMG } from '@/common/imgRatio';
import aliOssUpload from '@/utils/aliOssUpload';

const GlobalModalDrawerSet = (props) => {
  const { visible, onClose, userOs, dispatch, loading, childRef } = props;
  const { show = false, type = 'add', detail = {} } = visible;

  const [modalType, setModalType] = useState('url');
  const [form] = Form.useForm();

  //保存
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const { popUpImage, ...other } = values;
      const { version, area, cityCode, pageType, configGlobalPopUpId } = detail;
      const detailParam = { userOs, version, area, cityCode, pageType, configGlobalPopUpId };
      // 上传图片到oss -> 提交表单
      const imgList = await aliOssUpload(popUpImage);
      dispatch({
        type: {
          add: 'marketConfigure/fetchGlobalPopUpAdd',
          edit: 'marketConfigure/fetchGlobalPopUpEdit',
        }[type],
        payload: {
          ...other,
          ...detailParam,
          flag: { add: 'addConfig', edit: 'updateConfig' }[type],
          popUpImage: imgList.toString(),
          activityBeginTime: other.activityBeginTime[0].format('YYYY-MM-DD HH:mm'),
          activityEndTime: other.activityBeginTime[1].format('YYYY-MM-DD HH:mm'),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    visible: show,
    title: '弹窗内容配置',
    onClose,
    afterCallBack: () => {
      setModalType(detail.popUpType);
    },
    zIndex: 1001,
    footer: (
      <Button
        type="primary"
        onClick={handleSave}
        loading={
          loading.effects['marketConfigure/fetchGlobalPopUpAdd'] ||
          loading.effects['marketConfigure/fetchGlobalPopUpEdit']
        }
      >
        保存
      </Button>
    ),
  };
  const formItems = [
    {
      label: '弹窗名称',
      name: 'name',
      maxLength: '15',
    },
    {
      label: '弹窗频率',
      name: 'frequencyType',
      type: 'radio',
      select: MODAL_FREQUENCY,
    },
    {
      label: '推送时间',
      type: 'rangePicker',
      name: 'activityBeginTime',
      end: 'activityEndTime',
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
      disabledDate: (current) => current && current < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '弹窗类型',
      name: 'popUpType',
      type: 'radio',
      select: userOs === 'weChat' ? MARKET_MODAL_TYPE : { url: '链接' },
      onChange: (e) => {
        setModalType(e.target.value);
      },
    },
    {
      label: '弹窗图片',
      type: 'upload',
      name: 'popUpImage',
      maxFile: 1,
      extra: '请上传900*1077px png、jpeg、gif图片',
      imgRatio: GLOBAL_MODAL_IMG,
      visible: modalType === 'image',
    },
    {
      label: '弹窗链接',
      name: 'popUpUrl',
      visible: modalType === 'url',
    },
    // {
    //   type: 'noForm',
    //   visible: modalType === 'image',
    //   formItem: <NewNativeFormSet form={form} detail={detail}></NewNativeFormSet>,
    // },
    {
      label: '可见范围',
      name: 'visibleRange',
      type: 'radio',
      select: MARKET_LOOK_AREA,
    },
  ];
  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({ loading }))(GlobalModalDrawerSet);
