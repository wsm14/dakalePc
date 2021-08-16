import { Popover } from 'antd-mobile';
import React from 'react';

const HeaderDropdown = ({ ...restProps }) => (
  <Popover
    mask
    overlayClassName="fortest"
    overlayStyle={{ color: 'currentColor' }}
    align={{
      overflow: { adjustY: 0, adjustX: 0 },
      offset: [0, 10],
    }}
    {...restProps}
  />
);

export default HeaderDropdown;
