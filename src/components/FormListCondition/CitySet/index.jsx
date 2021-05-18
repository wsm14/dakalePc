import React from 'react';
import isEqual from 'lodash/isEqual';
import { Form, Button } from 'antd';
import { Cascader } from '@/components/FormCondition/formModule';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';

const CitySelect = ({ form, name, areaType, setCityData, maxLength, changeOnSelect = false }) => {
  // 检查城市是否已选
  const checkCityData = (rule, value) => {
    if (!value) {
      return Promise.resolve();
    }
    const cityData = form.getFieldValue(name).filter(
      // 判断城市是否已经选择
      // 省是否已选 当data长度为1 时只选了省，数据中存在该省做提示
      // 市是否已选 当data长度为2 时只选了市，数据中存在该市做提示
      // 区 当data长度为3 时选择到了区，数据中存在该市，省做提示
      (item = {}) => {
        const { city = '' } = item;
        const pCode = city.includes(value[0]);
        const cCode = city.includes(value[1]);
        return (
          city &&
          (isEqual(value, city) ||
            (value.length === 1 && pCode) ||
            (value.length === 2 && ((city.length === 1 && pCode) || cCode)) ||
            (value.length === 3 && ((city.length === 1 && pCode) || (city.length === 2 && cCode))))
        );
      },
    );
    if (cityData.length > 1) {
      return Promise.reject('城市范围重复，请确认');
    }
    return Promise.resolve();
  };
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => {
        return (
          <>
            {fields.map((field, i) => (
              <div key={field.key} className={styles.app_city_select}>
                <Form.Item
                  name={[field.name, 'city']}
                  fieldKey={[field.fieldKey, 'city']}
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: '请选择' }, { validator: checkCityData }]}
                >
                  <Cascader
                    changeOnSelect={changeOnSelect}
                    cityType={areaType}
                    onChange={(val, option) => setCityData && setCityData(option)}
                  />
                </Form.Item>
                {fields.length > 1 && (
                  <MinusCircleOutlined
                    onClick={() => remove(field.name)}
                    className={styles.app_icon}
                  />
                )}
              </div>
            ))}
            <Button
              disabled={maxLength ? fields.length === maxLength : false}
              onClick={() => add()}
              type="primary"
            >
              <PlusOutlined />
              {maxLength ? `${fields.length} / ${maxLength} 添加` : `添加（${fields.length}）`}
            </Button>
          </>
        );
      }}
    </Form.List>
  );
};

export default CitySelect;
