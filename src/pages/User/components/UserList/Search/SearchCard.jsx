import React from 'react';
import { Cascader } from 'antd';
import CITYJSON from '@/common/city';

const SearchCard = ({ setSearchData, bucket }) => {
  return (
    <Cascader
      defaultValue={bucket ? [bucket] : []}
      changeOnSelect
      expandTrigger="hover"
      options={CITYJSON}
      style={{
        width: 256,
      }}
      placeholder={`请选择省市区`}
      showSearch={{
        filter: (inputValue, path) => {
          return path.some((option) => option.label.indexOf(inputValue) > -1);
        },
      }}
      onChange={(val) =>
        setSearchData({
          provinceCode: val[0],
          cityCode: val[1],
          districtCode: val[2],
        })
      }
    ></Cascader>
  );
};

export default SearchCard;
