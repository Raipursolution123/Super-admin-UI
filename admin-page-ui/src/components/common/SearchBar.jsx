import React, { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value) => {
    console.log('Searching for:', value);
    // Implement search logic here
  };

  return (
    <Input
      placeholder="Search..."
      prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onPressEnter={() => handleSearch(searchValue)}
      style={{
        width: 300,
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
      }}
      className="hover-glow"
    />
  );
};

export default SearchBar;
