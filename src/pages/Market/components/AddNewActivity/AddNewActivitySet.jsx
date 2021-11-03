import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, Tabs } from 'antd';
import CITYJSON from '@/common/cityJson';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const AddNewActivitySet = (props) => {
  const { dispatch, childRef, visible = false, onClose } = props;
  const [form] = Form.useForm();

  const { TabPane } = Tabs;
  const [tabKey, setTabKey] = useState('1'); // tab
  const [prizeTypes, setPrizeTypes] = useState('a'); // 奖品类型

  // 新增活动
  const fetchMarketActivityAdd = () => {
    // form.validateFields().then((values) => {
    //   const {
    //     activityBeginTime: time,
    //     activityBanner: { fileList },
    //   } = values;
    //   const payload = {
    //     ...values,
    //     activityBeginTime: time[0].format('YYYY-MM-DD 00:00:00'),
    //     activityEndTime: time[1].format('YYYY-MM-DD 00:00:00'),
    //   };
    //   aliOssUpload(fileList.map((item) => item.originFileObj)).then((res) => {
    //     dispatch({
    //       type: 'marketCardActivity/fetchMarketActivityAdd',
    //       payload: { ...payload, activityBanner: res.toString() },
    //       callback: () => {
    //         onClose();
    //         childRef.current.fetchGetData();
    //       },
    //     });
    //   });
    // });
  };

  // 切换tab标签页
  function callback(key) {
    setTabKey(key);
  }

  const formItems = [
    {
      label: '活动城市',
      name: 'cityName',
      type: 'select',
      select: CITYJSON.filter((item) => item.level === '2'),
      // fieldNames: { label: 'name', value: 'id' },
      // onChange: (val, group) =>
      // // console.log(group, 'group'),
      // setCityArr(
      //   group.map(({ option }) => ({
      //     cityCode: option.id,
      //     cityName: option.name,
      //   })),
      // ),
    },
    {
      label: '活动名称',
      name: 'activityName',
      maxLength: 15,
    },
    {
      label: '邀请条件',
      type: 'number',
      name: 'activityName',
      suffix: '位用户即可获奖',
      formatter: (value) => `邀请 ${value}`,
      parser: (value) => value.replace('邀请', ''),
    },
    {
      label: '活动时间',
      type: 'rangePicker',
      name: 'activityBeginTime',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '活动规则',
      name: 'activityUrl',
      placeholder: '请输入链接',
      addRules: [
        {
          type: 'url',
          message: '请输入正确链接格式',
        },
      ],
    },
    {
      title: '图片配置',
      label: '活动主页图',
      type: 'upload',
      name: 'activityBanner',
      imgRatio: 750 / 600,
      extra: '请上传750*600px的jpg、png图片',
      maxFile: 1,
    },
    {
      label: '分享海报图',
      type: 'upload',
      name: 'activityBanner',
      imgRatio: 750 / 1334,
      extra: '请上传750*1334px的jpg、png图片',
      maxFile: 1,
    },
    {
      label: '小程序分享图',
      type: 'upload',
      name: 'activityBanner',
      imgRatio: 5 / 4,
      maxSize: 128,
      extra: '请上传比例为5*4，大小128kb以内的jpg图片（375*300以上）',
      maxFile: 1,
    },
    {
      label: '奖品图',
      type: 'upload',
      name: 'activityBanner',
      imgRatio: 600 / 240,
      extra: '请上传600*240px的jpg、png图片',
      maxFile: 1,
    },
    {
      label: '活动介绍图',
      type: 'upload',
      name: 'activityBanner',
      imgRatio: 686 / 800,
      extra: '请上传686*800px的jpg、png图片',
      maxFile: 1,
    },
    {
      label: '领奖成功跳转路径',
      type: 'select',
      name: 'uuu',
      select: ['卡豆盲盒', '新手福利页'],
    },
    {
      label: '奖品类型',
      name: 'abc',
      type: 'radio',
      select: { a: '卡豆', b: 'KA商品', c: '权益商品' },
      onChange: (e) => {
        setPrizeTypes(e.target.value);
      },
    },
    {
      label: '卡豆',
      name: 'activityName',
      placeholder: '请输入奖励卡豆数',
      visible: prizeTypes === 'a',
    },
    {
      label: '发放数量',
      name: 'activityName',
      visible: prizeTypes === 'a',
    },
    {
      label: '短信模板编号',
      name: 'activityName',
      visible: prizeTypes === 'b',
    },
    {
      label: '发放数量',
      name: 'activityName',
      visible: prizeTypes === 'b',
    },
    {
      label: '权益商品',
      name: 'activityName',
      visible: prizeTypes === 'c',
    },
  ];

  const modalProps = {
    title: `新增活动`,
    visible,
    onClose,
    width: 800,
    afterCallBack: () => {
      form.resetFields();
    },
    footer: (
      <Button type="primary" onClick={() => fetchMarketActivityAdd()}>
        确定
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      <Tabs activeKey={tabKey} onChange={callback}>
        <TabPane tab="Tab 1" key="1">
          <FormCondition
            form={form}
            formItems={formItems}
            initialValues={{ abc: 'a', uuu: 0 }}
          ></FormCondition>
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    </DrawerCondition>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  // marketCardActivity,
  // loading,
}))(AddNewActivitySet);
