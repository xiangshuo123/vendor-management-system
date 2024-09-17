import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './SupplierInfoPage.css';

const SupplierInfoPage = () => {
  const [supplierInfo, setSupplierInfo] = useState({
    company_name: '',
    business_nature: '',
    contact_name: '',
    contacts: [],
    contact_phone: '',
    mobile_phone: '',
    country: '',
    state: '',
    city: '',
    district: '',
    landline: '',
    fax: '',
    email: '',
    bank_account_name: '',
    bank_name: '',
    bank_account_number: '',
    production_capacity: '',
    advantage: '',
  });
  const [defaultContactIndex, setDefaultContactIndex] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [errors, setErrors] = useState({});

  // 模拟获取认证令牌（在真实应用中，应从登录状态或上下文中获取）
  const token = localStorage.getItem('token'); // 假设令牌存储在 localStorage 中

  // 在组件加载时获取供应商信息
  useEffect(() => {
    const fetchSupplierInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/suppliers/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 添加认证令牌
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSupplierInfo(data);
            // 如果需要显示最后更新时间，可以从数据中获取
            setLastUpdated(data.updated_at || 'N/A');
          }
        } else {
          console.error('Failed to fetch supplier info');
        }
      } catch (error) {
        console.error('Error fetching supplier info:', error);
      }
    };

    fetchSupplierInfo();
  }, [token]);

  // 输入验证函数
  const validateFields = () => {
    let newErrors = {};
    if (!supplierInfo.mobile_phone) newErrors.mobile_phone = '手机为必填项';
    if (!supplierInfo.country) newErrors.country = '国家为必填项';
    if (!supplierInfo.state) newErrors.state = '省为必填项';
    if (!supplierInfo.city) newErrors.city = '市为必填项';
    if (!supplierInfo.landline) newErrors.landline = '座机号码为必填项';
    if (!supplierInfo.fax) newErrors.fax = '传真号为必填项';
    if (!supplierInfo.email) {
      newErrors.email = '邮箱为必填项';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(supplierInfo.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCountryChange = (selectedOption) => {
    setSupplierInfo((prevState) => ({
      ...prevState,
      country: selectedOption.value,
      state: '',
      city: '',
    }));
  };

  const handleStateChange = (selectedOption) => {
    setSupplierInfo((prevState) => ({
      ...prevState,
      state: selectedOption.value,
      city: '',
    }));
  };

  const handleCityChange = (selectedOption) => {
    setSupplierInfo((prevState) => ({
      ...prevState,
      city: selectedOption.value,
    }));
  };

  const handleAddContact = () => {
    setSupplierInfo((prevState) => ({
      ...prevState,
      contacts: [...prevState.contacts, { name: '', isDefault: false }],
    }));
  };

  const handleSave = async () => {
    if (!validateFields()) {
      alert('请填写所有必填项，并确保输入有效的信息！');
      return;
    }
    try {
      console.log('Supplier Info to save:', supplierInfo); // 打印发送的数据以调试

      const response = await fetch('http://localhost:5000/api/suppliers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 添加认证令牌
        },
        body: JSON.stringify(supplierInfo),
      });

      if (!response.ok) {
        const errorData = await response.json(); // 获取错误信息
        console.error('Error response from server:', errorData);
        throw new Error(
          `Failed to save supplier info: ${errorData.message || 'Unknown error'}`
        );
      }

      const result = await response.json();
      console.log('Supplier saved successfully:', result);
      alert('供应商信息保存成功！');
    } catch (error) {
      console.error('Error saving supplier info:', error); // 打印错误信息
      alert(`Error saving supplier info: ${error.message}`);
    }
  };

  // 硬编码的国家、省、市数据
  const countries = [
    { value: 'China', label: 'China' },
    { value: 'USA', label: 'USA' },
  ];

  const states = {
    China: [
      { value: 'Guangdong', label: 'Guangdong' },
      { value: 'Beijing', label: 'Beijing' },
    ],
    USA: [
      { value: 'California', label: 'California' },
      { value: 'NewYork', label: 'New York' },
    ],
  };

  const cities = {
    Guangdong: [
      { value: 'Guangzhou', label: 'Guangzhou' },
      { value: 'Shenzhen', label: 'Shenzhen' },
    ],
    Beijing: [
      { value: 'Chaoyang', label: 'Chaoyang' },
      { value: 'Haidian', label: 'Haidian' },
    ],
    California: [
      { value: 'LosAngeles', label: 'Los Angeles' },
      { value: 'SanFrancisco', label: 'San Francisco' },
    ],
    NewYork: [
      { value: 'NewYorkCity', label: 'New York City' },
      { value: 'Buffalo', label: 'Buffalo' },
    ],
  };

  return (
    <div className="supplier-info-container">
      <h1 className="supplier-info-title">供应商信息</h1>

      {/* 基本信息部分 */}
      <div className="section">
        <h2 className="section-title">基本信息</h2>
        <div className="form-row">
          <label>公司名称：</label>
          <input
            type="text"
            name="company_name"
            value={supplierInfo.company_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label>经营性质：</label>
          <input
            type="text"
            name="business_nature"
            value={supplierInfo.business_nature}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label>负责人姓名：</label>
          <input
            type="text"
            name="contact_name"
            value={supplierInfo.contact_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-row">
          <label>联系电话：</label>
          <input
            type="text"
            name="contact_phone"
            value={supplierInfo.contact_phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-row">
          <label>手机：<span className="required">*</span></label>
          <input
            type="text"
            name="mobile_phone"
            value={supplierInfo.mobile_phone}
            onChange={handleInputChange}
            required
          />
          {errors.mobile_phone && <span className="error-text">{errors.mobile_phone}</span>}
        </div>
        <div className="form-row">
          <label>国家：<span className="required">*</span></label>
          <Select
            options={countries}
            onChange={handleCountryChange}
            placeholder="选择国家"
            value={countries.find((c) => c.value === supplierInfo.country)}
          />
          {errors.country && <span className="error-text">{errors.country}</span>}
        </div>
        <div className="form-row">
          <label>省：<span className="required">*</span></label>
          <Select
            options={supplierInfo.country ? states[supplierInfo.country] : []}
            onChange={handleStateChange}
            placeholder="选择省"
            value={states[supplierInfo.country]?.find((s) => s.value === supplierInfo.state)}
          />
          {errors.state && <span className="error-text">{errors.state}</span>}
        </div>
        <div className="form-row">
          <label>市：<span className="required">*</span></label>
          <Select
            options={supplierInfo.state ? cities[supplierInfo.state] : []}
            onChange={handleCityChange}
            placeholder="选择市"
            value={cities[supplierInfo.state]?.find((c) => c.value === supplierInfo.city)}
          />
          {errors.city && <span className="error-text">{errors.city}</span>}
        </div>
        <div className="form-row">
          <label>座机号码：<span className="required">*</span></label>
          <input
            type="text"
            name="landline"
            value={supplierInfo.landline}
            onChange={handleInputChange}
            required
          />
          {errors.landline && <span className="error-text">{errors.landline}</span>}
        </div>
        <div className="form-row">
          <label>传真号：<span className="required">*</span></label>
          <input
            type="text"
            name="fax"
            value={supplierInfo.fax}
            onChange={handleInputChange}
            required
          />
          {errors.fax && <span className="error-text">{errors.fax}</span>}
        </div>
        <div className="form-row">
          <label>邮箱：<span className="required">*</span></label>
          <input
            type="email"
            name="email"
            value={supplierInfo.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
      </div>

      {/* 银行信息部分 */}
      <div className="section">
        <h2 className="section-title">银行信息</h2>
        <div className="form-row">
          <label>受益人：</label>
          <input
            type="text"
            name="bank_account_name"
            value={supplierInfo.bank_account_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label>开户银行：</label>
          <input
            type="text"
            name="bank_name"
            value={supplierInfo.bank_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label>银行账号：</label>
          <input
            type="text"
            name="bank_account_number"
            value={supplierInfo.bank_account_number}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* 生产信息部分 */}
      <div className="section">
        <h2 className="section-title">生产信息</h2>
        <div className="form-row">
          <label>生产能力：</label>
          <input
            type="text"
            name="production_capacity"
            value={supplierInfo.production_capacity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label>优势：</label>
          <textarea
            name="advantage"
            value={supplierInfo.advantage}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
      </div>

      {/* 联系人信息部分 */}
      <div className="section">
        <h2 className="section-title">联系人信息</h2>
        {supplierInfo.contacts.map((contact, index) => (
          <div key={index} className="contact-row">
            <div className="form-row">
              <label>联系人姓名：</label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => {
                  const newContacts = [...supplierInfo.contacts];
                  newContacts[index].name = e.target.value;
                  setSupplierInfo((prevState) => ({
                    ...prevState,
                    contacts: newContacts,
                  }));
                }}
              />
            </div>
            <div className="form-row">
              <label>
                <input
                  type="checkbox"
                  checked={contact.isDefault}
                  onChange={() => {
                    const newContacts = supplierInfo.contacts.map((c, i) => ({
                      ...c,
                      isDefault: i === index,
                    }));
                    setSupplierInfo((prevState) => ({
                      ...prevState,
                      contacts: newContacts,
                    }));
                  }}
                />
                默认联系人
              </label>
            </div>
          </div>
        ))}
        <button onClick={handleAddContact}>添加联系人</button>
      </div>

      <button onClick={handleSave} className="save-button">
        保存
      </button>
      <p className="last-updated">最后更新：{lastUpdated || 'N/A'}</p>
    </div>
  );
};

export default SupplierInfoPage;
