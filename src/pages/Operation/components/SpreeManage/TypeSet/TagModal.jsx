import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Input, Tooltip, Modal, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
      // setTags([
      //   {
      //     giftTypeId: '1476433649157206018',
      //     typeName: '一星升二星礼包',
      //   },
      //   {
      //     giftTypeId: '1476433305564016642',
      //     typeName: '新人礼包',
      //   },
      // ]);
    }
  }, [show]);

  const saveEditInputRef = useRef();
  const saveInputRef = useRef();

  // 获取礼包类型
  const handleGetTags = () => {
    dispatch({
      type: 'SpreeManage/fetchListGiftType',
      callback: (tag) => {
        setTags(tag);
      },
    });
  };

  // 新增/修改礼包类型
  const handleSetTags = (val, type) => {
    const url = {
      add: 'SpreeManage/fetchCreateGiftType',
      edit: 'SpreeManage/fetchUpdateGiftType',
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

  // 回车时新增标签
  const handleInputConfirm = () => {
    setInputVisible(false);
    if (inputValue === '') return;
    // console.log(inputValue, tags, 'handleInputConfirm');
    if (tags.some((item) => item.typeName === inputValue)) {
      setInputValue('');
      return;
    }
    handleSetTags({ typeName: inputValue }, 'add');
    setInputValue('');
  };

  // 回车修改时
  const handleEditInputConfirm = () => {
    setInputVisible(false);
    if (inputValue === '') return;
    if (tags.some((item) => item.typeName === inputValue)) {
      setInputValue('');
      return;
    }
    handleSetTags({ typeName: inputValue, giftTypeId: editInputId }, 'edit');
    setInputValue('');
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
                    onBlur={() => (setInputVisible(false), setEditInputId(''), setInputValue(''))}
                    onPressEnter={handleEditInputConfirm}
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
                onBlur={() => (setInputVisible(false), setEditInputId(''), setInputValue(''))}
                onPressEnter={handleInputConfirm}
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
