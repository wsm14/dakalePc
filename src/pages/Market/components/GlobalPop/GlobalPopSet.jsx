import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { BANNER_PORT_LINK, BANNER_AREA_TYPE, BANNER_LOOK_AREA } from '@/common/constant';
import { CitySet, NativeFormSet } from '@/components/FormListCondition';
import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const GlobalPopSet = (props) => {
  const { dispatch, childRef, visible, onClose } = props;

  const { show = false, type = 'add', detail = {} } = visible;
  const [form] = Form.useForm();
  const [showArea, setShowArea] = useState(false); // 区域
  const [showTitle, setShowTitle] = useState(null); // 是否显示标题
  const formItems = [
    {
      label: '弹窗名称',
      name: 'name',
      maxLength: 15,
    },
    {
      label: '弹窗位置',
      type: 'select',
      name: 'bannerType',
      //   select: BANNER_PORT_LINK[tabKey],
    },
    {
      label: '弹框频率',
      name: 'description',
      type: 'select',
    },
    {
      label: '活动时间',
      type: 'rangePicker',
      name: 'activeDate',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '弹框图片',
      type: 'upload',
      name: 'coverImg',
      maxFile: 1,
    },
    {
      label: '应用范围',
      type: 'radio',
      name: 'deliveryAreaType',
      select: BANNER_AREA_TYPE,
      onChange: (e) => setShowArea(e.target.value === 'detail'),
    },
    {
      label: '选择区县',
      type: 'formItem',
      visible: showArea,
      formItem: (
        <CitySet
          name="provinceCityDistrictObjects"
          form={form}
          maxLength={10}
          changeOnSelect={true}
        ></CitySet>
      ),
    },

    {
      label: '可见范围',
      type: 'radio',
      name: 'visibleRange',
      select: BANNER_LOOK_AREA,
    },
    {
      type: 'noForm',
      formItem: (
        <NativeFormSet form={form} detail={detail} getJumpType={setShowTitle}></NativeFormSet>
      ),
    },
    {
      label: '权重',
      name: 'weight',
      type: 'number',
      min: 1,
      precision: 0,
      placeholder: '请输入数字，数值越大，权重越高，排在越前',
    },
  ];

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log(values, '2222');
    });
  };

  const modalProps = {
    title: type === 'edit' ? '编辑' : '新增',
    visible: show,
    onClose,
    afterCallBack: () => {
      setShowTitle(detail.jumpUrlType);
      setShowArea(detail.deliveryAreaType === 'detail');
    },
    footer: (
      <Button type="primary" onClick={handleSave}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={detail} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect()(GlobalPopSet);
