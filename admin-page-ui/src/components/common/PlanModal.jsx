import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, Row, Col } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const billingCycleOptions = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
];

const planNameOptions = ["Free", "Basic", "Premium", "Enterprise"];

const PlanModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        plan_name: initialData.plan_name,
        description: initialData.description,
        price: initialData.price,
        billing_cycle: initialData.billing_cycle,
        max_employees: initialData.max_employees === null ? null : initialData.max_employees,
        is_active: initialData.is_active,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialData, form]);

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        plan_name: values.plan_name,
        description: values.description,
        price: values.price || 0,
        billing_cycle: values.billing_cycle,
        max_employees: values.max_employees || null, // null for unlimited
        is_active: values.is_active !== undefined ? values.is_active : true,
      };
      setSaving(true);
      const success = await onSubmit(payload);
      setSaving(false);
      if (success) {
        onClose();
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
      setSaving(false);
    }
  };

  return (
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
          {initialData ? "Edit Plan" : "Create New Plan"}
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={handleFinish}
      okText="Save"
      confirmLoading={saving}
      destroyOnClose
      width={700}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="plan_name"
              label={<span style={{ fontWeight: 500 }}>Plan Name</span>}
              rules={[{ required: true, message: "Select plan name" }]}
            >
              <Select placeholder="Select Plan Type" size="large">
                {planNameOptions.map((name) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="billing_cycle"
              label={<span style={{ fontWeight: 500 }}>Billing Cycle</span>}
              rules={[{ required: true, message: "Select billing cycle" }]}
            >
              <Select placeholder="Select billing cycle" size="large">
                {billingCycleOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={<span style={{ fontWeight: 500 }}>Description</span>}
          rules={[{ required: true, message: "Enter description" }]}
        >
          <TextArea rows={3} placeholder="Brief description of the plan..." />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="price"
              label={<span style={{ fontWeight: 500 }}>Price</span>}
              rules={[{ required: true, message: "Enter price" }]}
            >
              <InputNumber
                placeholder="0"
                size="large"
                style={{ width: '100%' }}
                min={0}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="max_employees"
              label={<span style={{ fontWeight: 500 }}>Max Employees</span>}
              tooltip="Leave empty for unlimited"
            >
              <InputNumber
                placeholder="Unlimited"
                size="large"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="is_active"
          label={<span style={{ fontWeight: 500 }}>Active Status</span>}
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PlanModal;
