import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import {
  BANNER_PORT_LINK,
  BANNER_AREA_TYPE,
  BANNER_LOOK_AREA,
  COUPON_ACTIVE_TYPE,
} from '@/common/constant';
import { CitySet, JumpFormSet } from '@/components/FormListCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const SysAppSet = (props) => {
  const { dispatch, cRef, visible, onClose, tabKey, radioType, loading } = props;

  const { show = false, type = 'add', detail = { provinceCityDistrictObjects: [{}] } } = visible;
  const [form] = Form.useForm();
  const [showArea, setShowArea] = useState(false); // 区域
  const [showRadio, setShowRadio] = useState(null); // 图片分辨率
  const [showTitle, setShowTitle] = useState(null); // 是否显示标题
  const [timeRule, setTimeRule] = useState(null); // 展示时间规则 fixed 固定 infinite 长期

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { beginDate } = detail;
      const {
        coverImg,
        beginDate: time = [],
        jumpUrlType,
        hideTitle = false,
        timeRuleData, // fixed 固定 infinite 长期 长期时endDate 为2999-12-30 23:59:59
        provinceCityDistrictObjects: cityData = [],
      } = values;
      // 城市数据整理
      const provinceCityDistrictObjects = cityData.map(({ city }) => ({
        provinceCode: city[0],
        cityCode: city[1],
        districtCode: city[2],
      }));
      // 上传图片到oss -> 提交表单
      aliOssUpload(coverImg).then((res) => {
        dispatch({
          type: { add: 'sysAppList/fetchBannerSet', edit: 'sysAppList/fetchBannerEdit' }[type],
          payload: {
            bannerId: detail.bannerIdString,
            ...values,
            userType: tabKey,
            hideTitle: Number(!hideTitle),
            provinceCityDistrictObjects,
            jumpUrlType: jumpUrlType === '无' ? '' : jumpUrlType,
            coverImg: res.toString(),
            beginDate:
              timeRuleData === 'fixed'
                ? time[0].format('YYYY-MM-DD 23:59:59')
                : type === 'add' // 选择长期 新增开始时间为当前时间 修改 为原始数据的已选时间
                ? moment().format('YYYY-MM-DD 00:00:00')
                : beginDate[0].format('YYYY-MM-DD 00:00:00'),
            endDate:
              timeRuleData === 'fixed'
                ? time[1].format('YYYY-MM-DD 23:59:59')
                : '2999-12-30 23:59:59',
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
      select: BANNER_PORT_LINK[tabKey],
      onChange: setShowRadio,
    },
    {
      label: '图片上传',
      type: 'upload',
      name: 'coverImg',
      visible: showRadio,
      maxFile: 1,
      imgRatio: radioType[tabKey][showRadio],
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
      formItem: <CitySet name="provinceCityDistrictObjects" form={form} maxLength={10}></CitySet>,
    },
    {
      label: '展示时间',
      type: 'radio',
      select: COUPON_ACTIVE_TYPE,
      name: 'timeRuleData',
      onChange: (e) => setTimeRule(e.target.value),
    },
    {
      label: '设置时间',
      name: 'beginDate',
      type: 'rangePicker',
      visible: timeRule === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      type: 'noForm',
      formItem: (
        <JumpFormSet
          form={form}
          detail={detail}
          port={tabKey}
          getJumpType={setShowTitle}
        ></JumpFormSet>
      ),
    },
    {
      label: '是否显示标题',
      type: 'switch',
      name: 'hideTitle',
      visible: showTitle === 'H5',
    },
  ];

  const modalProps = {
    title: type === 'edit' ? '编辑' : '新增',
    visible: show,
    onClose,
    afterCallBack: () => {
      setShowTitle(detail.jumpUrlType);
      setTimeRule(detail.timeRuleData);
      setShowRadio(!!detail.bannerType);
      setShowArea(detail.deliveryAreaType === 'detail');
    },
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
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

export default connect(({ sysAppList, loading }) => ({
  radioType: sysAppList.radioType,
  loading: loading.models.sysAppList,
}))(SysAppSet);
