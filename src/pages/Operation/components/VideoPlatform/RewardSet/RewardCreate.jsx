import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import {
  SHARE_AREA_TYPE,
  SHARE_TASTE_TYPE,
  SHARE_SEX_TYPE,
  SHARE_AGE_TYPE,
} from '@/common/constant';
import { CitySet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const RewardCreate = (props) => {
  const {
    dispatch,
    visible,
    propertyJSON = {},
    childRef,
    onClose,
    tasteTag,
    loading,
    loadingJSON,
  } = props;

  // 默认选择项
  const inputData = { scope: 'all', areaType: 'all', taste: 'all', gender: 'ALL', age: '0-100' };

  const [form] = Form.useForm();

  const [areaType, setAreaType] = useState('all'); // 地域选择
  const [ageType, setAgeType] = useState('0-100'); // 年龄
  const [tasteType, setTastetype] = useState('all'); // 兴趣选择

  // 确认发布
  const handleVideoPush = () => {};

  // 获取配置文件
  const fetchGetPropertyJSON = () => {
    dispatch({
      type: 'baseData/fetchGetPropertyJSON',
    });
  };

  // 获取兴趣标签
  const fetchGetTasteTag = () => {
    dispatch({
      type: 'baseData/fetchGetTasteTag',
    });
  };

  const formItems = [
    {
      label: '性别',
      name: 'gender',
      type: 'radio',
      select: SHARE_SEX_TYPE,
    },
    {
      label: '年龄',
      name: 'age',
      type: 'radio',
      select: SHARE_AGE_TYPE,
      onChange: (e) => setAgeType(e.target.value),
    },
    {
      label: '年龄段',
      name: 'ageData',
      type: 'checkbox',
      visible: ageType === 'age',
      select: propertyJSON['momentAge'],
      fieldNames: { label: 'description' },
    },
    {
      label: '地域',
      name: 'areaType',
      type: 'radio',
      select: SHARE_AREA_TYPE,
      onChange: (e) => {
        form.setFieldsValue({ cityList: [[]] });
        setAreaType(e.target.value);
      },
    },
    {
      label: '选择城市',
      type: 'formItem',
      visible: ['city', 'district'].includes(areaType),
      formItem: (
        <CitySet
          name="cityList"
          form={form}
          maxLength={50}
          areaType={areaType}
          changeOnSelect={false}
          // 后端选择省时要所有市级code 省市数据分开字段 需要自己整理 这版没做处理 太麻烦了
          // setCityData={(option) => option.length === 1 && saveExtraStorage('city', option)}
        ></CitySet>
      ),
    },
    {
      label: '附近区域',
      name: 'area',
      type: 'radio',
      visible: areaType === 'near',
      select: propertyJSON['nearDistance'],
      fieldNames: { label: 'description' },
    },
    {
      label: '兴趣',
      name: 'taste',
      type: 'radio',
      select: SHARE_TASTE_TYPE,
      onChange: (e) => setTastetype(e.target.value),
    },
    {
      label: '选择兴趣',
      type: 'treeSelect',
      name: 'tagsId',
      multiple: true,
      visible: tasteType === 'tag',
      select: tasteTag.map(({ domainId, domainName, domainDTOList }) => ({
        domainId,
        domainName,
        domainDTOList,
        disabled: true,
      })),
      fieldNames: {
        label: 'domainName',
        value: 'domainId',
        children: 'domainDTOList',
      },
    },
  ];

  const modalProps = {
    title: '发布分享',
    visible,
    onClose,
    loading: loadingJSON,
    afterCallBack: () => {
      fetchGetPropertyJSON();
      fetchGetTasteTag();
    },
    closeCallBack: () => {},
    footer: (
      <>
        <Button type="primary" onClick={handleVideoPush} loading={loading}>
          确认发布
        </Button>
      </>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={inputData}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading, baseData }) => ({
  tasteTag: baseData.tasteTag,
  propertyJSON: baseData.propertyJSON,
  loadingJSON: loading.effects['baseData/fetchGetPropertyJSON'],
  loading: loading.effects['videoPlatform/fetchShareVideoPush'],
}))(RewardCreate);
