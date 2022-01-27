import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Form, Button, InputNumber } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';
import { NewNativeFormSet } from '@/components/FormListCondition';
import { NEW_POP_IMG } from '@/common/imgRatio';
import aliOssUpload from '@/utils/aliOssUpload';
import ShareCoupon from './ShareCoupon/ShareCoupon';

const GlobalModalDrawerSet = (props) => {
  const { visible, onClose, dispatch, loading, childRef } = props;
  const { show = false, type = 'add', detail = {} } = visible;
  const { configNewUserPopUpId } = detail;

  console.log(detail);

  const [form] = Form.useForm();

  const [banType, setBanType] = useState('0'); //是否Banner展示

  useEffect(() => {
    if (type === 'edit') {
      setBanType(detail.isShowBanner);
    }
  }, [type]);

  //保存
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      console.log(values);

      const { activityBeginTime: time, bannerImage, activityGoodsObjects, ...other } = values;

      // 上传图片到oss -> 提交表单
      const imgList = await aliOssUpload(bannerImage);
      dispatch({
        type: {
          add: 'marketConfigure/fetchSaveConfigNewUserPopUp',
          edit: 'marketConfigure/fetchUpdateConfigNewUserPopUp',
        }[type],
        payload: {
          configNewUserPopUpId,
          ...other,
          userOs: detail.userOs,
          activityBeginTime: time[0].format('YYYY-MM-DD HH:mm'),
          activityEndTime: time[1].format('YYYY-MM-DD HH:mm'),
          bannerImage: imgList.toString(),
          goodsIds: activityGoodsObjects.map((item) => item.activityGoodsId).toString(),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      title: '弹窗配置',
      label: '活动名称',
      name: 'name',
      maxLength: '15',
    },
    {
      label: '活动时间',
      type: 'rangePicker',
      name: 'activityBeginTime',
      end: 'activityEndTime',
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
      disabledDate: (current) => current && current < moment().endOf('day').subtract(1, 'day'),
    },
    {
      title: '福利页配置',
      label: 'Banner展示',
      type: 'radio',
      name: 'isShowBanner',
      select: ['关闭', '开启'],
      onChange: (e) => {
        setBanType(e.target.value);
      },
    },
    {
      label: '选择图片',
      type: 'upload',
      name: 'bannerImage',
      maxFile: 1,
      extra: '请上传560*760px png、jpeg、gif图片',
      imgRatio: NEW_POP_IMG,
      visible: banType === '1',
    },
    {
      type: 'noForm',
      visible: banType === '1',
      formItem: <NewNativeFormSet form={form} detail={detail}></NewNativeFormSet>,
    },
    {
      label: '选择电商品',
      type: 'formItem',
      name: 'goodsIds',
      required: true,
      formItem: (
        <>
          <ShareCoupon type="activityGoodsObjects" form={form}></ShareCoupon>
        </>
      ),
    },
  ];

  const modalProps = {
    visible: show,
    title: '弹窗内容配置',
    onClose,
    zIndex: 1001,
    footer: (
      <Button
        type="primary"
        onClick={handleSave}
        loading={
          loading.effects['marketConfigure/fetchSaveConfigNewUserPopUp'] ||
          loading.effects['marketConfigure/fetchUpdateConfigNewUserPopUp']
        }
      >
        保存
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({ loading }))(GlobalModalDrawerSet);
