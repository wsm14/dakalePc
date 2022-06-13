import React from 'react';
import { Button, Input } from 'antd';
import update from 'immutability-helper';

const AddSpecification = (props) => {
  const {
    specificationTypeData = [],
    setSpecificationTypeData,
    commissionShow = '0', // 分佣模板类型
  } = props;

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
          <div key={`${val.name}${index}`}>
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
                    key={`${val.name}${item}${idx}`}
                    style={{ width: 80, marginRight: 10, marginBottom: 10 }}
                    defaultValue={item}
                    onBlur={(e) => updateSpecificationValue(e, index, idx)}
                    addonAfter={<div onClick={() => delSpecificationValue(index, idx)}>×</div>}
                  ></Input>
                );
              })}
              <Button
                disabled={commissionShow === '1'}
                type="link"
                onClick={() => addSpecificationValue(index)}
              >
                添加规格值
              </Button>
            </div>
          </div>
        );
      })}
      <Button
        disabled={commissionShow === '1'}
        type="primary"
        ghost
        onClick={() => addSpecificationType()}
      >
        添加规格项
      </Button>
      {commissionShow === '1' && (
        <div style={{ display: 'inline-block', marginLeft: 5, color: '#ccc' }}>
          手动分佣不允许多规格
        </div>
      )}
    </>
  );
};

export default AddSpecification;
