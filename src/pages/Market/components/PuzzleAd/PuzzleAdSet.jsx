import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import {
  PUZZLE_AD_TYPE,
  BANNER_AREA_TYPE,
  BANNER_JUMP_TYPE,
  COUPON_ACTIVE_TYPE,
} from '@/common/constant';
import { CitySet, JumpFormSet } from '@/components/FormListCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const PuzzleAdSet = (props) => {
  const { visible, cRef, onClose, loadings, loading, dispatch } = props;

  const { type, show = false, info = '' } = visible;
  const [form] = Form.useForm();

  const [showType, setShowType] = useState(false); // 上传文件根据接口改变文件参数key
  const [fileUpload, setFileUpload] = useState(false); // 上传确认按钮loading
  const [showArea, setShowArea] = useState(false); // 区域
  const [timeRule, setTimeRule] = useState(null); // 展示时间规则 fixed 固定 infinite 长期

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { activeDate } = info;
      const {
        activeDate: time,
        provinceCityDistrictObjects: cityData = [],
        jumpUrlType,
        timeRuleData,
      } = values;
      // 城市数据整理
      const provinceCityDistrictObjects = cityData.map(({ city }) => ({
        provinceCode: city[0],
        cityCode: city[1],
        districtCode: city[2],
      }));
      // 上传图片到oss -> 提交表单
      setFileUpload(true);
      aliOssUpload(values[showType]).then((res) => {
        setFileUpload(false);
        dispatch({
          type: 'puzzleAd/fetchPuzzleAdSet',
          payload: {
            ...values,
            [showType]: res.toString(),
            jumpUrlType: jumpUrlType === '无' ? '' : jumpUrlType,
            provinceCityDistrictObjects,
            puzzleAdsId: info.puzzleAdsId,
            startShowTime:
              timeRuleData === 'fixed'
                ? time[0].format('YYYY-MM-DD')
                : type === 'add'
                ? moment().format('YYYY-MM-DD')
                : activeDate[0].format('YYYY-MM-DD'),
            endShowTime: timeRuleData === 'fixed' ? time[1].format('YYYY-MM-DD') : '2999-12-30',
            activeDate: undefined,
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
      label: '广告类型',
      type: 'select',
      name: 'type',
      select: PUZZLE_AD_TYPE,
      onChange: (value) => {
        setShowType(value);
        form.setFieldsValue({ descsdription: '' });
      },
      render: (val) => PUZZLE_AD_TYPE[val],
    },
    {
      label: '广告说明',
      type: 'textArea',
      name: 'description',
      rules: [{ required: false }],
    },
    {
      label: '图片上传',
      type: 'upload',
      maxFile: 5,
      visible: showType === 'image',
      show: showType === 'image',
      name: 'image',
    },
    {
      label: '视频上传',
      type: 'videoUpload',
      maxFile: 1,
      visible: showType === 'video',
      show: showType === 'video',
      name: 'video',
      extra: '仅支持MP4',
    },
    {
      label: '展示时间',
      type: 'radio',
      select: COUPON_ACTIVE_TYPE,
      name: 'timeRuleData',
      onChange: (e) => setTimeRule(e.target.value),
      render: (val, record) =>
        `${record.startShowTime} -- ${
          record.endShowTime !== '2999-12-30 00:00' ? record.endShowTime : '长期'
        }`,
    },
    {
      label: '设置时间',
      name: 'activeDate',
      type: 'rangePicker',
      visible: timeRule === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
      show: false,
    },
    {
      label: '品牌名',
      name: 'brandName',
    },
    {
      label: '应用范围',
      type: 'radio',
      name: 'deliveryAreaType',
      show: false,
      select: BANNER_AREA_TYPE,
      onChange: (e) => setShowArea(e.target.value === 'detail'),
    },
    {
      label: '选择区县',
      type: 'formItem',
      show: false,
      visible: showArea,
      formItem: <CitySet name="provinceCityDistrictObjects" form={form} maxLength={10}></CitySet>,
    },
    {
      type: 'noForm',
      show: false,
      formItem: <JumpFormSet form={form} detail={info}></JumpFormSet>,
    },
    {
      label: '跳转事件',
      name: 'jumpUrlType',
      visible: false,
      render: (val) => BANNER_JUMP_TYPE[val],
    },
    {
      label: '跳转内容',
      name: 'jumpUrl',
      visible: false,
      show: info.jumpUrlType !== '无',
      render: (val, row) => {
        const { jumpUrlType, nativeJumpName, param = {} } = row;
        return {
          H5: val,
          inside: `${nativeJumpName}${param.scenesName ? ' -' + param.scenesName : ''}`,
        }[jumpUrlType];
      },
    },
    {
      label: '投放区域',
      name: 'deliveryAreaType',
      visible: false,
      render: (val, row) =>
        ({
          all: BANNER_AREA_TYPE[val],
          detail: row.deliveryAreaNameStr,
        }[val]),
    },
  ];

  const closeDrawer = () => {
    onClose();
  };

  const title = { add: '新增', edit: '编辑', info: '详情' }[type];

  const modalProps = {
    title: `${title}`,
    visible: show,
    loading: loadings.effects['businessBrand/fetchGetList'],
    onClose: closeDrawer,
    afterCallBack: () => {
      setTimeRule(info.timeRuleData);
      setShowType(info.type);
      setShowArea(info.deliveryAreaType === 'detail');
    },
    footer:
      type !== 'info' ? (
        <Button onClick={fetchGetFormData} type="primary" loading={loading || fileUpload}>
          确认
        </Button>
      ) : null,
  };

  return (
    <DrawerCondition {...modalProps}>
      {type === 'info' ? (
        <DescriptionsCondition initialValues={info} formItems={formItems}></DescriptionsCondition>
      ) : (
        <FormCondition initialValues={info} formItems={formItems} form={form} />
      )}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loadings: loading,
  loading: loading.models.puzzleAd,
}))(PuzzleAdSet);
