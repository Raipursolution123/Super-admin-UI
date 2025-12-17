import React from 'react';
import { Button } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      icon={isDark ? <SunOutlined style={{ fontSize: '18px' }} /> : <MoonOutlined style={{ fontSize: '18px' }} />}
      onClick={toggleTheme}
      style={{
        width: 40,
        height: 40,
        borderRadius: '8px',
      }}
      className="hover-scale"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    />
  );
};

export default ThemeToggle;
