import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  List,
  Button,
  Input,
  Tag,
  Modal,
  Form,
  Select,
  Switch,
  message,
  Tabs,
  Collapse,
  Space,
  Tooltip,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SendOutlined,
  CopyOutlined,
  DesktopOutlined,
  MobileOutlined,
  SearchOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion } from 'framer-motion';
import { emailTemplatesAPI } from '../services/emailTemplatesService';

const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const EmailSettings = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop or mobile
  const [form] = Form.useForm();

  const categories = [
    { name: 'Account Management', icon: '👤', color: '#667eea' },
    { name: 'Subscription & Billing', icon: '💳', color: '#10b981' },
    { name: 'Product Updates', icon: '🚀', color: '#f59e0b' },
    { name: 'Admin Actions', icon: '⚙️', color: '#ef4444' },
  ];

  const availableVariables = [
    '{{company_name}}',
    '{{admin_name}}',
    '{{plan_name}}',
    '{{trial_end_date}}',
    '{{login_url}}',
    '{{reset_password_url}}',
    '{{support_email}}',
    '{{activation_url}}',
    '{{invoice_number}}',
    '{{amount}}',
    '{{payment_date}}',
  ];

  // Fetch templates
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await emailTemplatesAPI.getAll({ category: selectedCategory, search: searchText });
      setTemplates(res.data);
      setFilteredTemplates(res.data);
      if (res.data.length > 0 && !selectedTemplate) {
        setSelectedTemplate(res.data[0]);
      }
    } catch (error) {
      message.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory, searchText]);

  // Group templates by category
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      name: template.name,
      category: template.category,
      subject: template.subject,
      body: template.body,
      is_active: template.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDeleteTemplate = async (templateId) => {
    Modal.confirm({
      title: 'Delete Template',
      content: 'Are you sure you want to delete this template?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await emailTemplatesAPI.delete(templateId);
          message.success('Template deleted successfully');
          fetchTemplates();
          if (selectedTemplate?.id === templateId) {
            setSelectedTemplate(null);
          }
        } catch (error) {
          message.error('Failed to delete template');
        }
      },
    });
  };

  const handleDuplicateTemplate = async (template) => {
    try {
      const duplicateData = {
        ...template,
        name: `${template.name} (Copy)`,
        is_default: false,
      };
      delete duplicateData.id;
      delete duplicateData.created_date;

      await emailTemplatesAPI.create(duplicateData);
      message.success('Template duplicated successfully');
      fetchTemplates();
    } catch (error) {
      message.error('Failed to duplicate template');
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const values = await form.validateFields();
      if (editingTemplate) {
        await emailTemplatesAPI.update(editingTemplate.id, values);
        message.success('Template updated successfully');
      } else {
        await emailTemplatesAPI.create(values);
        message.success('Template created successfully');
      }
      setIsModalOpen(false);
      fetchTemplates();
    } catch (error) {
      message.error('Failed to save template');
    }
  };

  const handleSendTestEmail = () => {
    Modal.confirm({
      title: 'Send Test Email',
      content: (
        <div>
          <p>Enter email address to send test:</p>
          <Input
            id="test-email-input"
            placeholder="test@example.com"
            type="email"
          />
        </div>
      ),
      onOk: async () => {
        const email = document.getElementById('test-email-input').value;
        if (email) {
          try {
            await emailTemplatesAPI.sendTest(selectedTemplate.id, email);
            message.success(`Test email sent to ${email}`);
          } catch (error) {
            message.error('Failed to send test email');
          }
        }
      },
    });
  };

  const insertVariable = (variable) => {
    const currentBody = form.getFieldValue('body') || '';
    form.setFieldsValue({ body: currentBody + ' ' + variable });
  };

  // Quill modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div style={{ height: 'calc(100vh - 200px)' }}>
      <Row gutter={[16, 16]} style={{ height: '100%' }}>
        {/* Left Sidebar - Template Library */}
        <Col xs={24} lg={6} style={{ height: '100%' }}>
          <Card
            title={
              <span style={{ fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                📧 Email Templates
              </span>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateTemplate}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                New
              </Button>
            }
            style={{ height: '100%', overflow: 'auto' }}
            bodyStyle={{ padding: '12px' }}
          >
            <Search
              placeholder="Search templates..."
              onSearch={handleSearch}
              style={{ marginBottom: '16px' }}
              prefix={<SearchOutlined />}
            />

            <Collapse
              defaultActiveKey={categories.map((c) => c.name)}
              ghost
              expandIconPosition="end"
            >
              {categories.map((category) => {
                const categoryTemplates = groupedTemplates[category.name] || [];
                return (
                  <Panel
                    key={category.name}
                    header={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{category.icon}</span>
                        <span style={{ fontWeight: 500 }}>{category.name}</span>
                        <Badge
                          count={categoryTemplates.length}
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                    }
                  >
                    <List
                      size="small"
                      dataSource={categoryTemplates}
                      renderItem={(template) => (
                        <List.Item
                          onClick={() => handleTemplateClick(template)}
                          style={{
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            marginBottom: '4px',
                            background:
                              selectedTemplate?.id === template.id
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : 'transparent',
                            color: selectedTemplate?.id === template.id ? 'white' : 'inherit',
                            transition: 'all 0.3s',
                          }}
                          className={selectedTemplate?.id !== template.id ? 'hover-lift' : ''}
                        >
                          <div style={{ width: '100%' }}>
                            <div style={{ fontWeight: 500, fontSize: '13px' }}>
                              {template.name}
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>
                              {template.is_active ? (
                                <CheckCircleOutlined style={{ marginRight: '4px' }} />
                              ) : (
                                <CloseCircleOutlined style={{ marginRight: '4px' }} />
                              )}
                              {template.is_active ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Panel>
                );
              })}
            </Collapse>
          </Card>
        </Col>

        {/* Center - Editor */}
        <Col xs={24} lg={12} style={{ height: '100%' }}>
          {selectedTemplate ? (
            <Card
              title={
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>
                    {selectedTemplate.name}
                  </div>
                  <Tag color={selectedTemplate.is_active ? 'success' : 'default'} style={{ marginTop: '4px' }}>
                    {selectedTemplate.is_active ? 'Active' : 'Inactive'}
                  </Tag>
                </div>
              }
              extra={
                <Space>
                  <Tooltip title="Edit">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEditTemplate(selectedTemplate)}
                    />
                  </Tooltip>
                  <Tooltip title="Duplicate">
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => handleDuplicateTemplate(selectedTemplate)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                    />
                  </Tooltip>
                  <Button
                    icon={<SendOutlined />}
                    type="primary"
                    onClick={handleSendTestEmail}
                  >
                    Test Email
                  </Button>
                </Space>
              }
              style={{ height: '100%', overflow: 'auto' }}
            >
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 500, marginBottom: '8px' }}>Subject Line:</div>
                <Input
                  value={selectedTemplate.subject}
                  readOnly
                  style={{ background: '#f5f5f5' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 500, marginBottom: '8px' }}>Available Variables:</div>
                <Space wrap>
                  {selectedTemplate.variables?.map((variable) => (
                    <Tag key={variable} color="blue" style={{ cursor: 'pointer' }}>
                      {`{{${variable}}}`}
                    </Tag>
                  ))}
                </Space>
              </div>

              <div>
                <div style={{ fontWeight: 500, marginBottom: '8px' }}>Email Body:</div>
                <div
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '16px',
                    background: 'white',
                    minHeight: '400px',
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedTemplate.body }}
                />
              </div>
            </Card>
          ) : (
            <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#999' }}>
                <MailOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>Select a template to view</div>
              </div>
            </Card>
          )}
        </Col>

        {/* Right - Preview */}
        <Col xs={24} lg={6} style={{ height: '100%' }}>
          <Card
            title={
              <span style={{ fontWeight: 600 }}>Preview</span>
            }
            extra={
              <Space>
                <Tooltip title="Desktop View">
                  <Button
                    icon={<DesktopOutlined />}
                    type={previewMode === 'desktop' ? 'primary' : 'default'}
                    onClick={() => setPreviewMode('desktop')}
                  />
                </Tooltip>
                <Tooltip title="Mobile View">
                  <Button
                    icon={<MobileOutlined />}
                    type={previewMode === 'mobile' ? 'primary' : 'default'}
                    onClick={() => setPreviewMode('mobile')}
                  />
                </Tooltip>
              </Space>
            }
            style={{ height: '100%', overflow: 'auto' }}
          >
            {selectedTemplate ? (
              <div
                style={{
                  width: previewMode === 'mobile' ? '375px' : '100%',
                  margin: '0 auto',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  background: 'white',
                  transition: 'width 0.3s',
                }}
              >
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                    From: HRMS Team &lt;noreply@hrms.com&gt;
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    To: admin@company.com
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>
                    {selectedTemplate.subject}
                  </div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: selectedTemplate.body }} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                <EyeOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>No preview available</div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div style={{
            fontSize: '20px',
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSaveTemplate}
        okText="Save"
        width={900}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={<span style={{ fontWeight: 500 }}>Template Name</span>}
                rules={[{ required: true, message: 'Enter template name' }]}
              >
                <Input placeholder="e.g. Welcome Email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label={<span style={{ fontWeight: 500 }}>Category</span>}
                rules={[{ required: true, message: 'Select category' }]}
              >
                <Select placeholder="Select category">
                  {categories.map((cat) => (
                    <Option key={cat.name} value={cat.name}>
                      {cat.icon} {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="subject"
            label={<span style={{ fontWeight: 500 }}>Subject Line</span>}
            rules={[{ required: true, message: 'Enter subject line' }]}
          >
            <Input placeholder="e.g. Welcome to {{company_name}}!" />
          </Form.Item>

          <Form.Item label={<span style={{ fontWeight: 500 }}>Insert Variables</span>}>
            <Space wrap>
              {availableVariables.map((variable) => (
                <Tag
                  key={variable}
                  color="blue"
                  style={{ cursor: 'pointer' }}
                  onClick={() => insertVariable(variable)}
                >
                  {variable}
                </Tag>
              ))}
            </Space>
          </Form.Item>

          <Form.Item
            name="body"
            label={<span style={{ fontWeight: 500 }}>Email Body</span>}
            rules={[{ required: true, message: 'Enter email body' }]}
          >
            <ReactQuill
              theme="snow"
              modules={modules}
              style={{ height: '300px', marginBottom: '50px' }}
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label={<span style={{ fontWeight: 500 }}>Status</span>}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmailSettings;