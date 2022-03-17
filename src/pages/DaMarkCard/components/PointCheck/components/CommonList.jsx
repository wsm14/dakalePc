import React from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import { DeleteOutlined } from '@ant-design/icons';
import './index.less';

const CommonList = ({item = {}, onDel}) => {
    console.log(item,'sassaa')
  const { name = '', address = '', id = '' } = item;

  return (
    <div className="Wrapers">
      <div className="wrapCard">
        <div className="comss">
          <Ellipsis length={9} tooltip className="names">
            {name}
          </Ellipsis>
          <span className="ids">{id}</span>
        </div>
        <div className="addressCon">
          <Ellipsis length={15} tooltip>
            {address}
          </Ellipsis>
        </div>
      </div>
      {onDel && <DeleteOutlined  onClick={onDel}/>}
      
    </div>
  );
};

export default CommonList;
