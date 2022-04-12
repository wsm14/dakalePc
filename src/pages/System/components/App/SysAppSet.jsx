import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Button, Form } from 'antd';
import { BANNER_PORT_LINK, BANNER_AREA_TYPE, BANNER_LOOK_AREA } from '@/common/constant';
import { CitySet, NewNativeFormSet } from '@/components/FormListCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const SysAppSet = (props) => {
  const { dispatch, cRef, visible, onClose, tabKey, radioType, loading, bannerTypeObj } = props;

  const { show = false, type = 'add', detail = {} } = visible;
  const { version, userType, userOs, area, cityCode, bannerIdString } = detail;

  const [form] = Form.useForm();
  const [showRadio, setShowRadio] = useState(null); // 图片分辨率
  const [showTitle, setShowTitle] = useState(null); // 是否显示标题

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { coverImg, hideTitle = false, activityTime } = values;

      const detailParam = { userType, userOs, version, area, cityCode };

      // 上传图片到oss -> 提交表单
      aliOssUpload(coverImg).then((res) => {
        dispatch({
          type: { add: 'sysAppList/fetchBannerSet', edit: 'sysAppList/fetchBannerEdit' }[type],
          payload: {
            bannerIdString,
            ...values,
            ...detailParam,
            flag: {
              add: 'addConfig',
              edit: 'updateConfig',
            }[type],
            beginDate: moment(activityTime[0]).format('YYYY-MM-DD'),
            endDate: moment(activityTime[1]).format('YYYY-MM-DD'),
            hideTitle: Number(!hideTitle),
            coverImg: res.toString(),
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: '图片位置',
      type: 'select',
      name: 'bannerType',
      select: bannerTypeObj,
      onChange: setShowRadio,
    },
    {
      label: '图片上传',
      type: 'upload',
      name: 'coverImg',
      visible: showRadio,
      maxFile: 1,
      imgRatio: radioType[showRadio],
    },
    {
      label: '活动时间',
      type: 'rangePicker',
      name: 'activityTime',
      disabledDate: (current) => current && current < moment().subtract(1, 'days'),
    },
    {
      label: '图片说明',
      type: 'textArea',
      name: 'description',
      maxLength: 200,
    },
    {
      label: '权重',
      name: 'weight',
      type: 'number',
      min: 1,
      precision: 0,
      placeholder: '请输入数字，数值越大，权重越高，排在越前',
    },
    {
      label: '可见范围',
      type: 'radio',
      name: 'visibleRange',
      hidden: tabKey === 'merchant',
      select: BANNER_LOOK_AREA,
    },
    {
      type: 'noForm',
      formItem: (
        <NewNativeFormSet
          form={form}
          detail={detail}
          port={tabKey}
          getJumpType={setShowTitle}
        ></NewNativeFormSet>
      ),
    },
    {
      label: '是否显示标题',
      type: 'switch',
      name: 'hideTitle',
      visible: showTitle === 'h5',
    },
  ];

  const modalProps = {
    title: type === 'edit' ? '编辑' : '新增',
    visible: show,
    onClose,
    afterCallBack: () => {
      setShowTitle(detail.jumpUrlType);
      setShowRadio(detail.bannerType);
    },
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
    zIndex: 1001,
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={detail} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ sysAppList, loading }) => ({
  radioType: sysAppList.radioType,
  loading: loading.models.sysAppList,
}))(SysAppSet);
