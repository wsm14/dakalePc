import React from 'react';
import { Button, Input } from 'antd';
import update from 'immutability-helper';

const AddSpecification = (props) => {
  const { specificationTypeData = [], setSpecificationTypeData } = props;

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
  const delSpecificationType = (index) => {
    const newData = update(specificationTypeData, {
      $splice: [[index, 1]],
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
  const delSpecificationValue = (index, idx) => {
    let list = specificationTypeData[index].value;
    const newData = update(specificationTypeData, {
      $splice: [
        [
          index,
          1,
          {
            ...specificationTypeData[index],
            value: update(list, {
              $splice: [[idx, 1]],
            }),
          },
        ],
      ],
    });
    setSpecificationTypeData(newData);
  };

  return (
    <>
      {specificationTypeData.map((val, index) => {
        return (
          <div key={val.name}>
            <Input
              defaultValue={val.name}
              onBlur={(e) => updateSpecificationType(e, index)}
              style={{ marginBottom: 10 }}
              addonAfter={<div onClick={() => delSpecificationType(index)}>×</div>}
            ></Input>
            <div>
              {val?.value?.map((item, idx) => {
                return (
                  <Input
                    key={`${val.name}${item}`}
                    style={{ width: 80, marginRight: 10, marginBottom: 10 }}
                    defaultValue={item}
                    onBlur={(e) => updateSpecificationValue(e, index, idx)}
                    addonAfter={<div onClick={() => delSpecificationValue(index, idx)}>×</div>}
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
