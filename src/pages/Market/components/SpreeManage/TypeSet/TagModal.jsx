import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Input, Tooltip, Modal, Row, Col, Button } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import './index.less';

const TagModal = (props) => {
  const { visible, onClose, dispatch } = props;
  const { show = false } = visible;

  const [tags, setTags] = useState([]); // 所有礼包
  const [inputVisible, setInputVisible] = useState(false); // 输入框的显示
  const [inputValue, setInputValue] = useState(''); // 输入框的内容
  const [editInputId, setEditInputId] = useState(''); // 获取选中的id

  useEffect(() => {
    if (show) {
      handleGetTags();
    }
  }, [show]);

  const saveEditInputRef = useRef();
  const saveInputRef = useRef();

  // 获取礼包类型
  const handleGetTags = () => {
    dispatch({
      type: 'spreeManage/fetchListGiftType',
      callback: (tag) => {
        setTags(tag);
      },
    });
  };

  // 新增/修改礼包类型
  const handleSetTags = (val, type) => {
    const url = {
      add: 'spreeManage/fetchCreateGiftType',
      edit: 'spreeManage/fetchUpdateGiftType',
    };
    dispatch({
      type: url[type],
      payload: val,
      callback: () => {
        handleGetTags();
      },
    });
  };

  // 点击新增标签时打开输入框
  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      saveInputRef.current?.focus();
    }, 100);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 新增/编辑 标签
  const handleInputConfirm = (mode) => {
    const val = inputValue.replace(/\s*/g, '');
    setInputVisible(false);
    setEditInputId('');
    setInputValue('');
    if (val === '') return;

    const payload = {
      add: { typeName: inputValue },
      edit: { typeName: inputValue, giftTypeId: editInputId },
    };
    handleSetTags(payload[mode], mode);
  };

  const modalProps = {
    zIndex: 1002,
    title: '礼包类型设置',
    visible: show,
    onCancel: onClose,
    afterClose: () => {
      setTags([]);
    },
    footer: <Button onClick={() => onClose()}>取消</Button>,
  };

  return (
    <Modal {...modalProps}>
      <Row gutter={[16, 16]}>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Col key={tag.giftTypeId} span={8} className="small-box">
              {editInputId === tag.giftTypeId ? (
                <div className="edit-tag-modal">
                  <Input
                    ref={saveEditInputRef}
                    className="tag-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    addonAfter={
                      <CheckOutlined
                        style={{ fontSize: 16 }}
                        onClick={() => handleInputConfirm('edit')}
                      />
                    }
                  />
                </div>
              ) : (
                <div
                  className="edit-tag-modal edit-tag-check"
                  onDoubleClick={(e) => {
                    setEditInputId(tag.giftTypeId);
                    setInputValue(tag.typeName);
                    setTimeout(() => {
                      saveEditInputRef.current?.focus();
                    }, 100);
                    e.preventDefault();
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag.typeName}
                </div>
              )}
              <div className="tag-id">{tag.giftTypeId}</div>
            </Col>
          );
          return isLongTag ? (
            <Tooltip title={tag.typeName} key={tag.giftTypeId}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        <Col span={8} className="small-box">
          <div className="edit-tag-modal">
            {inputVisible ? (
              <Input
                ref={saveInputRef}
                type="text"
                size="large"
                className="tag-input"
                value={inputValue}
                onChange={handleInputChange}
                addonAfter={
                  <CheckOutlined
                    style={{ fontSize: 16 }}
                    onClick={() => handleInputConfirm('add')}
                  />
                }
              />
            ) : (
              <Button
                icon={<PlusOutlined></PlusOutlined>}
                className="edit-tag-btn"
                onClick={showInput}
              ></Button>
            )}
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.userFollow,
}))(TagModal);
