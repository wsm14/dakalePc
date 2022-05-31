import React from 'react';
import { Button, Input } from 'antd';
import update from 'immutability-helper';

const AddSpecification = (props) => {
  const { specificationTypeData = [], setSpecificationTypeData } = props;
  console.log('specificationTypeData: ', specificationTypeData);

  // 添加规格项
  const addSpecificationType = () => {
    setSpecificationTypeData([...specificationTypeData, { name: '', value: [] }]);
  };
  const updateSpecificationType = (e, index) => {
    const newData = update(specificationTypeData, {
      $splice: [
        [
          index,
          1,
          {
            ...specificationTypeData[index],
            name: e.target.value,
          },
        ],
      ],
    });
    setSpecificationTypeData(newData);
  };

  // 添加规格值
  const addSpecificationValue = (index) => {
    let list = specificationTypeData[index].value;
    const newData = update(specificationTypeData, {
      $splice: [
        [
          index,
          1,
          {
            ...specificationTypeData[index],
            value: [...list, ''],
          },
        ],
      ],
    });
    setSpecificationTypeData(newData);
  };
  const updateSpecificationValue = (e, index, idx) => {
    let list = specificationTypeData[index].value;
    const newData = update(specificationTypeData, {
      $splice: [
        [
          index,
          1,
          {
            ...specificationTypeData[index],
            value: update(list, {
              $splice: [[idx, 1, e.target.value]],
            }),
          },
        ],
      ],
    });
    setSpecificationTypeData(newData);
  };

  // [
  //     { name: 'aa', value: [1, 1, 11] },
  //     { name: 'bb', value: [{ aa: 1 }, {aa: 3}] },
  //   ]
  return (
    <>
      {specificationTypeData.map((val, index) => {
        return (
          <div key={val.name}>
            <Input
              defaultValue={val.name}
              onBlur={(e) => updateSpecificationType(e, index)}
              style={{ marginBottom: 10 }}
            ></Input>
            <div>
              {val?.value?.map((item, idx) => {
                return (
                  <Input
                    key={`${val.name}${item}`}
                    style={{ width: 50, marginRight: 10, marginBottom: 10 }}
                    defaultValue={item}
                    onBlur={(e) => updateSpecificationValue(e, index, idx)}
                  ></Input>
                );
              })}
              <Button type="link" onClick={() => addSpecificationValue(index)}>
                添加规格值
              </Button>
            </div>
          </div>
        );
      })}
      <Button type="primary" ghost onClick={() => addSpecificationType()}>
        添加规格项
      </Button>
    </>
  );
};

export default AddSpecification;
