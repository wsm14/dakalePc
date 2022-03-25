import React, { useState, useEffect } from 'react';
import { Cascader, Spin } from 'antd';
import { connect } from 'umi';
import { Pie } from '@/components/Charts';
import CITY from '@/common/city';
import SearchBlock from '../SearchBlock';

const VideoNum = ({ PGCList, UGCList, dispatch, loading }) => {
  const [data, setData] = useState({
    cityCode: '3301',
    subType: 'onShelfMomentAmount',
  });
  const [city, setCity] = useState('3301');

  useEffect(() => {
    dispatch({
      type: 'videoDataStat/fetchMomentNumAnalysisReport',
      payload: data,
    });
  }, [data]);

  return (
    <div>
      <div style={{ marginTop: 25 }}>
        <Cascader
          value={[city.slice(0, 2), city]}
          options={CITY.map((item) => ({
            ...item,
            children: item.children.map((citem) => ({ ...citem, children: undefined })),
          }))}
          onChange={(val) => {
            setCity(val[1]);
            setData((old) => ({ ...old, cityCode: val[1] }));
          }}
          placeholder="请选择地区"
        />
      </div>
      <SearchBlock
        data={data}
        setData={setData}
        btnObj={{
          onShelfMomentAmount: '上架中视频数',
          momentTotalAmount: '视频库总数',
          newOnShelfMomentAmount: '新增视频数',
        }}
        btnObjKeyName="subType"
        timeOk={false}
      ></SearchBlock>
      <div style={{ display: 'flex', width: '100%', height: 500, marginTop: 25 }}>
        <div style={{ flex: 1 }}>
          <Spin spinning={loading}>
            <Pie data={PGCList} title="PGC" innerRadius={0.6} legend={{ position: 'bottom' }} />
          </Spin>
        </div>
        <div style={{ flex: 1 }}>
          <Spin spinning={loading}>
            <Pie data={UGCList} title="UGC" innerRadius={0.6} legend={{ position: 'bottom' }} />
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default connect(({ videoDataStat, loading }) => ({
  UGCList: videoDataStat.UGCList,
  PGCList: videoDataStat.PGCList,
  loading: loading.effects['videoDataStat/fetchMomentNumAnalysisReport'],
}))(VideoNum);
