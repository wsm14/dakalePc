import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import {
  SHARE_AREA_TYPE,
  SHARE_TASTE_TYPE,
  SHARE_SEX_TYPE,
  SHARE_AGE_TYPE,
} from '@/common/constant';
import { CitySet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';

/**
 * 投放设置
 */
const SharePutInSet = (props) => {
  const { form, propertyJSON = {}, saveExtraStorage, tasteTag, detail = {} } = props;
  // 默认选择项
  const inputData = { scope: 'all', areaType: 'all', taste: 'all', gender: 'ALL', age: '1-100' };

  const [areaType, setAreaType] = useState('all'); // 地域选择
  const [ageType, setAgeType] = useState('1-100'); // 年龄
  // const [tasteType, setTastetype] = useState('all'); // 兴趣选择

  useEffect(() => {
    setAreaType(detail.areaType);
    setAgeType(detail.age);
    // setTastetype(detail.taste);
  }, []);

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
          setCityData={(option) => option.length === 1 && saveExtraStorage('city', option)}
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
    // {
    //   label: '兴趣',
    //   name: 'taste',
    //   type: 'radio',
    //   select: SHARE_TASTE_TYPE,
    //   onChange: (e) => setTastetype(e.target.value),
    // },
    // {
    //   label: '选择兴趣',
    //   type: 'treeSelect',
    //   name: 'tagsId',
    //   multiple: true,
    //   visible: tasteType === 'tag',
    //   select: tasteTag.map(({ domainId, domainName, domainDTOList }) => ({
    //     domainId,
    //     domainName,
    //     domainDTOList,
    //     disabled: true,
    //   })),
    //   fieldNames: {
    //     label: 'domainName',
    //     value: 'domainId',
    //     children: 'domainDTOList',
    //   },
    //   onChange: (val, options, extra) => {
    //     const { allCheckedNodes = [] } = extra;
    //     // 后端需要父级名字+id 子集名字+id 先将dom数据储存下来 后面整理数据给后端
    //     saveExtraStorage(
    //       'taste',
    //       allCheckedNodes.map((item) => item.node.props.item),
    //     );
    //   },
    // },
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
