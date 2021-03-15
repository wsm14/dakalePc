import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import {
  SHARE_SCOPE_TYPE,
  SHARE_AREA_TYPE,
  SHARE_TASTE_TYPE,
  SHARE_SEX_TYPE,
  SHARE_AGE_TYPE,
} from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import CitySelect from './PutInSet/CitySelect';

/**
 * 投放设置
 */
const SharePutInSet = (props) => {
  const {
    form,
    dispatch,
    propertyJSON = {},
    tasteTag,
    selectList,
    saveDataStorage,
    loading,
    detail = {},
  } = props;
  // 默认选择项
  const inputData = { scope: 'all', areaType: 'all', taste: 'all', gender: 'ALL', age: '1-100' };

  const [areaType, setAreaType] = useState('all'); // 地域选择
  const [cityData, setCityData] = useState([]); // 地域信息
  const [ageType, setAgeType] = useState('1-100'); // 年龄
  const [tasteType, setTastetype] = useState('all'); // 兴趣选择
  const [tasteData, setTasteData] = useState([]); // 兴趣信息

  useEffect(() => {
    setAreaType(detail.areaType);
    setAgeType(detail.age);
    setTastetype(detail.taste);
  }, []);

  const formItems = [
    {
      label: '用户群',
      name: 'scope',
      type: 'radio',
      select: SHARE_SCOPE_TYPE,
    },
    {
      label: '地域',
      name: 'areaType',
      type: 'radio',
      select: SHARE_AREA_TYPE,
      onChange: (e) => {
        form.setFieldsValue({ provinceCityDistrictObjects: [[]] });
        setAreaType(e.target.value);
      },
    },
    {
      label: '选择城市',
      type: 'formItem',
      visible: ['city', 'district'].includes(areaType),
      formItem: (
        <CitySelect
          name="provinceCityDistrictObjects"
          form={form}
          areaType={areaType}
          setCityData={(option) => setCityData([...cityData, option])}
        ></CitySelect>
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
      name: 'scenesId',
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
      onChange: (val, options, extra) => {
        const { selected } = extra;
        setTasteData(
          extra.allCheckedNodes.map((item) => {
            return selected ? item.node.props.item : item.props.item;
          }),
        );
      },
    },
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
  ];

  return (
    <FormCondition
      form={form}
      formItems={formItems}
      initialValues={{ ...inputData, ...detail }}
    ></FormCondition>
  );
};

export default connect(({ baseData, businessList, loading }) => ({
  tasteTag: baseData.tasteTag,
  propertyJSON: baseData.propertyJSON,
  selectList: businessList.selectList,
  loading: loading.models.businessList,
}))(SharePutInSet);
