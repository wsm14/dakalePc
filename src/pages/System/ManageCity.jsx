import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { CITY_STATUS } from '@/common/constant';
import CITYJSON from '@/common/city';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const ManageCity = (props) => {
  const { businessBrand, loading, dispatch } = props;

  const childRef = useRef();
  const [provinceList, setProvinceList] = useState(
    Object.assign([], CITYJSON).map((i) => ({
      cityName: i.label,
      locationCityIdString: i.value,
      children: [],
    })),
  );

  // table 表头
  const getColumns = [
    {
      title: '省/市',
      align: 'center',
      dataIndex: 'cityName',
    },
    {
      title: '背景图',
      align: 'center',
      dataIndex: 'backgroundImg',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '城市文案',
      align: 'center',
      dataIndex: 'cityDesc',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => CITY_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'locationCityIdString',
      align: 'right',
      render: (val, row) => (
        <HandleSetTable
          formItems={[
            {
              type: 'save',
              visible: !row.provinceCode,
              click: () =>
                handleSysMenuSet({
                  menuName: row.accessName,
                }),
            },
            {
              type: 'edit',
              visible: !!row.provinceCode,
              click: () => fetchGetMenuDetail({ accessId: val }),
            },
            {
              type: 'del',
              visible: !!row.provinceCode,
              click: () => fetchGetMenuDetail({ accessId: val }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading.models.businessBrand}
      columns={getColumns}
      rowKey={(record) => `${record.locationCityIdString}`}
      dispatchType="businessBrand/fetchGetList"
      pagination={false}
      list={provinceList}
    ></DataTableBlock>
  );
};

export default connect(({ businessBrand, sysTradeList, loading }) => ({
  businessBrand,
  tradeList: sysTradeList.list.list,
  loading,
}))(ManageCity);
