import React from 'react';

interface SectionContentProps {
  children: React.ReactNode;
}

const SectionContent: React.FC<SectionContentProps> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default SectionContent;
