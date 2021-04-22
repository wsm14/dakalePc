import React from 'react';

const Html5Simulate = ({ show, right = 650, children }) => {
  return (
    show && (
      <div
        style={{
          position: 'absolute',
          width: 337.5,
          height: 600.3,
          background: 'white',
          top: '25%',
          transform: 'translate(0, -50%)',
          right: right + 150,
          zIndex: 10000,
          boxShadow: '-1px 2px 3px #585858',
          borderRadius: 3,
          wordWrap: 'break-word',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
    )
  );
};

export default Html5Simulate;
