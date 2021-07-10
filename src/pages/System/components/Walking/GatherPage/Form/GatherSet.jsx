import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, InputNumber } from 'antd';
import { PAGE_STATUS, BANNER_AREA_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import { CitySet, NativeFormSet } from '@/components/FormListCondition';
import ConditionsForm from './ConditionsForm';
const GatherSet = (props) => {
  const { visible = {}, onClose, cRef, dispatch, loading } = props;
  const { show = false, type, detail = {areaType:'all'} } = visible;
  const { provinceCityDistrictObjects: cityArr = [], areaType } = detail;
  const [form] = Form.useForm();
  const [showArea, setShowArea] = useState(false); // 区域
  const [inValue, setInValue] = useState({}); // 区域

  useEffect(() => {
    if (show) {
      const formCityArr = cityArr.map((item) => {
        const { provinceCode: pCode, cityCode: cCode, districtCode: dCode } = item;
        return { city: [pCode, cCode, dCode].filter((i) => i) };
      });
      setInValue({ ...detail, provinceCityDistrictObjects: formCityArr });
      if (areaType === 'detail') {
        setShowArea(true);
      }
    }
  }, [show]);

  const handleConfirm = () => {
    const api = {
      edit: 'walkingManage/fetchGatherPageConfigUpdate',
      add: 'walkingManage/fetchGatherPageConfigAdd',
    }[type];

    form.validateFields().then((values) => {
      const {
        areaType,
        provinceCityDistrictObjects = [],
        evokeParamObjectList = [],
        recommendParamObject,
      } = values;

      const cityCodeArr = provinceCityDistrictObjects.map((items) => {
        const { city } = items;
        const [provinceCode, cityCode, districtCode] = city;
        return {
          provinceCode: provinceCode || '',
          cityCode: cityCode || '',
          districtCode: districtCode || '',
        };
      });
      const payload = {
        recommendParamObject,
        evokeParamObjectList,
        provinceCityDistrictObjects: cityCodeArr,
        areaType,
        configCollectionPageId: detail.configCollectionPageIdString,
      };
      dispatch({
        type: api,
        payload: payload,
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    visible: show,
    title: '配置',
    onClose,
    footer: (
      <Button type="primary" onClick={() => handleConfirm()} loading={loading}>
        确定
      </Button>
    ),
  };

  const formItems = [
    {
      label: '应用范围',
      type: 'radio',
      name: 'areaType',
      select: { all: '全平台' },
      onChange: (e) => setShowArea(e.target.value === 'detail'),
    },
    // {
    //   label: '选择区县',
    //   type: 'formItem',
    //   visible: showArea,
    //   formItem: (
    //     <CitySet
    //       name="provinceCityDistrictObjects"
    //       form={form}
    //       maxLength={10}
    //       changeOnSelect={true}
    //     ></CitySet>
    //   ),
    // },
    {
      label: '唤起配置',
      type: 'formItem',
      name: 'evokeParamObjectList',
      rules: [{ required: true }],
      formItem: <ConditionsForm></ConditionsForm>,
    },
    {
      label: '推荐配置',
      type: 'formItem',
      formItem: (
        <div>
          <div style={{ height: 30, width: '100%' }}></div>
          <div style={{ display: 'flex', alignItem: 'center' }}>
            <Form.Item
              label="价格"
              name={['recommendParamObject', 'minPrice']}
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: 150 }} min={0} />
            </Form.Item>
            <span style={{ margin: '5px 10px' }}>至</span>
            <Form.Item name={['recommendParamObject', 'maxPrice']} rules={[{ required: true }]}>
              <InputNumber style={{ width: 150 }} min={0} />
            </Form.Item>
            <span style={{ margin: '5px 10px' }}>元</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form} initialValues={inValue}></FormCondition>
    </DrawerCondition>
  );
};
export default connect(({ loading }) => ({ loading: loading.models.walkingManage }))(GatherSet);
