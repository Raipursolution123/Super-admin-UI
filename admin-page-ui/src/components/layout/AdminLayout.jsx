import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Grid,
  Breadcrumb,
  Drawer
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  CrownOutlined,
  MailOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../common/BackButton';
import SearchBar from '../common/SearchBar';
import NotificationCenter from '../common/NotificationCenter';
import ThemeToggle from '../common/ThemeToggle';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';


const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const dispatch = useDispatch();

  const { user: redUser } = useSelector(state => state.auth);

  // Fallback if user is not yet loaded in store (though it should be if protected)
  const user = redUser || {
    profile: {
      first_name: 'Super',
      last_name: 'Admin',
      role: 'Super Admin'
    }
  };

  const profile = user.profile || user; // handle if structure varies
  const role = user.role || user.profile?.role || 'Super Admin';



  const formatRole = (role) => {
    return role || 'Employee';
  };

  const sidebarMenuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/job-requirements',
      icon: <FileTextOutlined />,
      label: 'Job Requirements',
    },
    {
      key: '/plan-management',
      icon: <CrownOutlined />,
      label: 'Plan Management',
    },
    {
      key: '/company-management',
      icon: <TeamOutlined />,
      label: 'Company Details',
    },
    {
      key: '/email-settings',
      icon: <MailOutlined />,
      label: 'Email Settings',
    },
    
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (!screens.lg) {
      setCollapsed(true);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    // Redirect to main HRMS login
    window.location.href = 'http://localhost:3000/login';
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const breadcrumbItems = location.pathname.split('/').filter(i => i).map((i, index, arr) => ({
    title: i.charAt(0).toUpperCase() + i.slice(1),
    key: i,
    href: index === arr.length - 1 ? null : `/${arr.slice(0, index + 1).join('/')}`,
  }));

  const breadcrumb = (
    <div
      style={{
        padding: '16px 16px 0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Breadcrumb
        items={[
          { title: <HomeOutlined />, href: '/' },
          ...breadcrumbItems
        ]}
      />
      {location.pathname !== '/' && <BackButton />}
    </div>
  );

  const getFullName = () => {
    return `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User';
  };

  const formattedRole = formatRole(role);
  const displayName = getFullName() || 'User';

  // Sidebar content
  const SidebarContent = (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          padding: collapsed && screens.lg ? '16px 8px' : '16px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {collapsed && screens.lg ? (
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          />
        ) : (
          <div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                size={64}
                icon={<UserOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  marginBottom: '12px',
                  border: '3px solid rgba(255,255,255,0.3)',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '0',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid white',
              }} />
            </div>
            <div style={{ color: 'white' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px', fontFamily: 'Poppins, sans-serif' }}>
                {displayName}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {formattedRole}
              </div>
            </div>
          </div>
        )}
      </motion.div>
      <div className="logo" style={{
        padding: '16px',
        color: 'white',
        textAlign: 'center',
        fontSize: collapsed && screens.lg ? '16px' : '24px',
        fontWeight: 'bold',
        fontFamily: 'Poppins, sans-serif',
        background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {collapsed && screens.lg ? 'HR' : 'HRMS'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={sidebarMenuItems}
        onClick={handleMenuClick}
        style={{
          background: 'transparent',
          border: 'none',
        }}
        className="custom-menu"
      />
      <style>{`
        .custom-menu .ant-menu-item {
          margin: 4px 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .custom-menu .ant-menu-item:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateX(5px);
        }
        .custom-menu .ant-menu-item-selected {
          background: rgba(255, 255, 255, 0.2) !important;
          border-left: 3px solid #fff;
        }
        .custom-menu .ant-menu-item-icon {
          font-size: 18px;
        }
      `}</style>
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Mobile Drawer */}
      {!screens.lg && (
        <Drawer
          placement="left"
          onClose={() => setCollapsed(true)}
          open={!collapsed}
          width={250}
          styles={{ body: { padding: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } }}
          closable={false}
          maskClosable={true}
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* Desktop Sider */}
      {screens.lg && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={80}
          width={250}
          className="glass-sidebar"
        >
          {SidebarContent}
        </Sider>
      )}

      <Layout>
        <Header
          className="glass-header"
          style={{
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '18px',
                width: 48,
                height: 48,
                borderRadius: '8px',
              }}
              className="hover-scale"
            />
            {screens.md && <SearchBar />}
          </div>

          <Space size="middle">
            <ThemeToggle />
            {/* <NotificationCenter /> */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }} className="hover-scale">
                <Avatar
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                />
                {screens.md && (
                  <>
                    <span style={{ fontWeight: 500 }}>{displayName}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      ({formattedRole})
                    </span>
                  </>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        {breadcrumb}
        <Content
          style={{
            margin: screens.lg ? '24px 16px' : '12px 8px',
            padding: screens.lg ? 24 : 12,
            minHeight: 280,
            background: 'var(--bg-secondary)',
            borderRadius: 12,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
