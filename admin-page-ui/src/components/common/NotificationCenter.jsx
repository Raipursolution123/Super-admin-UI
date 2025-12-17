import React from 'react';
import { Badge, Dropdown, List, Button } from 'antd';
import { BellOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';

const NotificationCenter = () => {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'New user registered',
      description: 'John Doe just signed up',
      time: '5 minutes ago',
      icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
    },
    {
      id: 2,
      type: 'info',
      title: 'System update',
      description: 'New features available',
      time: '1 hour ago',
      icon: <InfoCircleOutlined style={{ color: '#3b82f6' }} />,
    },
    {
      id: 3,
      type: 'warning',
      title: 'Server maintenance',
      description: 'Scheduled for tonight',
      time: '2 hours ago',
      icon: <WarningOutlined style={{ color: '#f59e0b' }} />,
    },
  ];

  const notificationMenu = (
    <div style={{
      width: 350,
      maxHeight: 400,
      overflow: 'auto',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        fontWeight: 600,
        fontSize: '16px',
      }}>
        Notifications
      </div>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            className="hover-lift"
          >
            <List.Item.Meta
              avatar={item.icon}
              title={<span style={{ fontWeight: 500 }}>{item.title}</span>}
              description={
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {item.description}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                    {item.time}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
      }}>
        <Button type="link" style={{ fontWeight: 500 }}>
          View all notifications
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
      <Badge count={notifications.length} offset={[-5, 5]}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: '18px' }} />}
          style={{
            width: 40,
            height: 40,
            borderRadius: '8px',
          }}
          className="hover-scale"
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationCenter;
