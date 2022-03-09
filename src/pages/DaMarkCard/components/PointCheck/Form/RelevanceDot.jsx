import React, { useState } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { Button, Form, Space } from 'antd';
import FormCondition from '@/components/FormCondition';
import { Select } from '@/components/FormCondition/formModule';
import DrawerCondition from '@/components/DrawerCondition';
import CommonList from '../components/CommonList';
import ExtraButton from '@/components/ExtraButton';
import PointManageDrawer from '../../PointManage/PointManageDrawer';
import PointDrawer from '../../PointManage/Detail/Point/PointDrawer';
import '../components/index.less';

const RelevanceDot = (props) => {
  const { bodyList = [], pointList = [], dispatch, visible = {}, onClose, cRef } = props;
  const { show = false } = visible;
  const [bodySelect, setBodySelect] = useState([]); //选中的主体
  const [pointSelect, setPointSelect] = useState([]); //选中的点位
  const [showPoint, setShowPoint] = useState(false);
  const [showBody, setShowBody] = useState(false);
  const [visibleBody, setVisibleBody] = useState(false); //新增主体
  const [visiblePoint, setVisiblePoint] = useState(false); //新增点位
  const [bodyId, setBodyId] = useState(''); //单选 选中的主体id
  const [PointID, setPointID] = useState([]); //多选选中平的点位Id
  const [form] = Form.useForm();

  // 搜索主体
  const handleSearch = debounce((name) => {
    if (!name.replace(/'/g, '')) return;
    dispatch({
      type: 'pointManage/fetchGetList',
      payload: {
        name: name.replace(/'/g, ''),
        page: 1,
        limit: 999,
      },
    });
  }, 500);

  // 搜索打卡点位根据选中的主体获取点位列表
  const fetchGetMre = debounce((name) => {
    if (!name) return;
    dispatch({
      type: 'baseData/fetchListHitting',
      payload: {
        mainId: bodyId,
        name,
      },
    });
  }, 500);

  //选中 option,替换
  const onChangeBody = (val) => {
    const selectBodys = bodyList.filter((item) => val === item.hittingMainId);
    setBodyId(val);
    setBodySelect(selectBodys);
    setShowBody(false);
  };
  const onChangePoint = (val) => {
    const selectPoints = pointList.filter((item) => val.includes(item.value));
    setPointSelect(selectPoints);
    setPointID(val);
  };

  //新增主体/点位
  const handleAdd = (type) => {
    const setVisibleAdd = {
      body: setVisibleBody,
      point: setVisiblePoint,
    }[type];
    setVisibleAdd({
      type: 'add',
      show: true,
    });
  };

  const formItems = [
    {
      label: `关联主体`,
      type: 'formItem',
      name: 'body',
      formItem: (
        <>
          <Space>
            <Button
              onClick={() => {
                setShowBody(true);
              }}
            >
              请选择主体
            </Button>
            <Button type="link" onClick={() => handleAdd('body')}>
              +新增
            </Button>
          </Space>
          {showBody && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
              <Select
                allowClear
                placeholder="输入主体名称/ID"
                onSearch={handleSearch}
                onChange={onChangeBody}
                maxTagTextLength={5}
                value={bodyId}
                fieldNames={{ label: 'name', value: 'hittingMainId', tip: 'address' }}
                select={bodyList}
              ></Select>
            </div>
          )}
          {bodySelect.map((mItem) => (
            <div key={mItem.hittingMainId} style={{ marginTop: 10 }}>
              <CommonList
                item={{ name: mItem.name, address: mItem.address, id: mItem.hittingMainId }}
                onDel={() => {
                  setBodySelect([]);
                  setBodyId('');
                }}
              ></CommonList>
              <div className="bottomCon">
                <span>每人每天打卡次数</span>
                <span>1次</span>
              </div>
            </div>
          ))}
        </>
      ),
    },
    {
      label: `关联点位`,
      type: 'formItem',
      name: 'dot',
      visible: bodyId != '',
      formItem: (
        <>
          <Space>
            <Button
              onClick={() => {
                setShowPoint(true);
              }}
            >
              请选择点位
            </Button>
            <Button type="link" onClick={() => handleAdd('point')}>
              +新增
            </Button>
          </Space>
          {showPoint && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
              <Select
                type="multiple" //多选
                placeholder="输入点位名称/ID"
                onSearch={fetchGetMre}
                onChange={onChangePoint}
                maxTagTextLength={5}
                value={PointID}
                onBlur={() => setShowPoint(false)}
                select={pointList}
              ></Select>
            </div>
          )}
          {pointSelect.map((item1, index1) => (
            <div key={item1.value} style={{ marginTop: 10 }}>
              <CommonList
                item={{ name: item1.name, address: item1.otherData, id: item1.value }}
                onDel={() => {
                  setPointSelect(pointSelect.filter((ids) => ids.value != item1.value));
                  setPointID(PointID.filter((ID) => ID !== item1.value));
                }}
              ></CommonList>
              <div className="bottomCon">
                <span>每人每天打卡次数</span>
                <span>1次</span>
              </div>
            </div>
          ))}
        </>
      ),
    },
  ];

  //审核通过
  const handleCheck = () => {};

  const btnList = [
    {
      auth: 'check',
      onClick: handleCheck,
      text: '审核通过',
    },
  ];

  const modalProps = {
    title: '关联点位',
    visible: show,
    onClose,
    footer: <ExtraButton list={btnList}></ExtraButton>,
  };
  return (
    <>
      <DrawerCondition {...modalProps}>
        <FormCondition formItems={formItems} form={form}></FormCondition>
      </DrawerCondition>
      {/* 新增主体 */}
      <PointManageDrawer
        childRef={cRef}
        visible={visibleBody}
        onClose={() => setVisibleBody(false)}
      ></PointManageDrawer>
      {/* 新增 点位*/}
      <PointDrawer
        childRef={cRef}
        visible={visiblePoint}
        onClose={() => setVisiblePoint(false)}
      ></PointDrawer>
    </>
  );
};
export default connect(({ baseData, loading, pointManage }) => ({
  selectList: baseData.goodsList,
  pointList: baseData.pointList.list,
  bodyList: pointManage.list.list,
  loading: loading.effects['baseData/fetchGetGoodsSearch'],
}))(RelevanceDot);
