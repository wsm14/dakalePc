import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Card, Row, Col, Empty, Table } from 'antd';
import moment from 'moment';
import { ChoroplethMap } from '@/components/Charts';
import { getCityName } from '@/utils/utils';
import TimeSearch from './TimeSearch/TimeSearch';

const DistrictDistribution = (props) => {
  const { dispatch, provinceList, cityList, districtList } = props;

  const [provinceData, setProvinceData] = useState({
    startStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    statisticType: 'province',
  });
  const [cityData, setCityData] = useState({
    startStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    statisticType: 'city',
    code: '33',
  });
  const [districtData, setDistrictData] = useState({
    startStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    statisticType: 'district',
    code: '3301',
  });

  useEffect(() => {
    dispatch({
      type: 'userDataStat/fetchUserPortraitAreaReportProvince',
      payload: provinceData,
    });
  }, [provinceData]);

  useEffect(() => {
    dispatch({
      type: 'userDataStat/fetchUserPortraitAreaReportCity',
      payload: cityData,
    });
  }, [cityData]);

  useEffect(() => {
    dispatch({
      type: 'userDataStat/fetchUserPortraitAreaReportDistrict',
      payload: districtData,
    });
  }, [districtData]);

  const provinceColumns = [
    {
      title: '省份',
      dataIndex: 'provinceCode',
      align: 'center',
      render: (val) => getCityName(val.slice(0, 2)),
    },
    {
      title: '用户数',
      dataIndex: 'totalAreaNum',
      align: 'center',
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      align: 'center',
    },
  ];

  const cityColumns = [
    {
      title: <div>111</div>,
      dataIndex: 'cityCode',
      align: 'center',
      render: (val) => getCityName(val.slice(0, 4)),
    },
    {
      title: '用户数',
      dataIndex: 'totalAreaNum',
      align: 'center',
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      align: 'center',
    },
  ];

  const districtColumns = [
    {
      title: '区县',
      dataIndex: 'districtCode',
      align: 'center',
      render: (val) => getCityName(val),
    },
    {
      title: '用户数',
      dataIndex: 'totalAreaNum',
      align: 'center',
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      align: 'center',
    },
  ];

  const provinceProps = {
    sourceField: 'provinceCode',
    field: 'totalAreaNum',
  };

  const cityProps = {
    sourceField: 'cityCode',
    field: 'totalAreaNum',
    viewLevel: {
      level: 'province',
      adcode: 330000,
    },
  };

  const districtProps = {
    sourceField: 'districtCode',
    field: 'totalAreaNum',
    viewLevel: {
      level: 'city',
      adcode: 330100,
    },
  };

  return (
    <div>
      <Card title="省级分布" bordered={false}>
        <TimeSearch data={provinceData} setData={setProvinceData}></TimeSearch>
        <Row style={{ minHeight: 300, marginTop: 35 }}>
          <Col span={14}>
            {provinceList.length ? (
              <div style={{ width: '100%', height: '100%' }}>
                <ChoroplethMap data={provinceList} {...provinceProps} />
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Col>
          <Col span={10}>
            <Table rowKey="provinceCode" columns={provinceColumns} dataSource={provinceList} />
          </Col>
        </Row>
      </Card>
      <Card title="地级分布" bordered={false}>
        <TimeSearch data={cityData} setData={setCityData}></TimeSearch>
        <Row style={{ minHeight: 300, marginTop: 35 }}>
          <Col span={14}>
            {cityList.length ? (
              <div style={{ width: '100%', height: '100%' }}>
                <ChoroplethMap data={cityList} {...cityProps} />
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Col>
          <Col span={10}>
            <Table rowKey="cityCode" columns={cityColumns} dataSource={cityList} />
          </Col>
        </Row>
      </Card>
      <Card title="区域分布" bordered={false}>
        <TimeSearch data={districtData} setData={setDistrictData}></TimeSearch>
        <Row style={{ minHeight: 300, marginTop: 35 }}>
          <Col span={14}>
            {districtList.length ? (
              <div style={{ width: '100%', height: '100%' }}>
                <ChoroplethMap data={districtList} {...districtProps} />
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Col>
          <Col span={10}>
            <Table rowKey="districtCode" columns={districtColumns} dataSource={districtList} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default connect(({ userDataStat }) => ({
  provinceList: userDataStat.provinceList,
  cityList: userDataStat.cityList,
  districtList: userDataStat.districtList,
}))(DistrictDistribution);
