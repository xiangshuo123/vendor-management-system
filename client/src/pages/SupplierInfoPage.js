import React, { useState } from 'react';
import Select from 'react-select';
import './SupplierInfoPage.css';

const SupplierInfoPage = () => {
  const [supplierInfo, setSupplierInfo] = useState({
    company_name: '',
    business_nature: '',
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
      { value: 'New York', label: 'New York' },
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
      { value: 'Los Angeles', label: 'Los Angeles' },
      { value: 'San Francisco', label: 'San Francisco' },
    ],
    NewYork: [
      { value: 'New York City', label: 'New York City' },
      { value: 'Buffalo', label: 'Buffalo' },
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCountryChange = (selectedOption) => {
    setSupplierInfo((prevState) => ({ ...prevState, country: selectedOption.value, state: '', city: '' }));
  };

  const handleStateChange = (selectedOption) => {
    setSupplierInfo((prevState) => ({ ...prevState, state: selectedOption.value, city: '' }));
  };

  const handleCityChange = (selectedOption) => {
    setSupplierInfo((prevState) => ({ ...prevState, city: selectedOption.value }));
  };

  const handleAddContact = () => {
    setSupplierInfo((prevState) => ({
      ...prevState,
      contacts: [...prevState.contacts, { name: '', isDefault: false }],
    }));
  };

  const handleSave = async () => {
    alert('供应商信息保存成功！');
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
          <label>国家：</label>
          <Select
            options={countries}
            onChange={handleCountryChange}
            placeholder="选择国家"
            value={countries.find((c) => c.value === supplierInfo.country)}
          />
        </div>
        <div className="form-row">
          <label>省：</label>
          <Select
            options={supplierInfo.country ? states[supplierInfo.country] : []}
            onChange={handleStateChange}
            placeholder="选择省"
            value={states[supplierInfo.country]?.find((s) => s.value === supplierInfo.state)}
          />
        </div>
        <div className="form-row">
          <label>市：</label>
          <Select
            options={supplierInfo.state ? cities[supplierInfo.state] : []}
            onChange={handleCityChange}
            placeholder="选择市"
            value={cities[supplierInfo.state]?.find((c) => c.value === supplierInfo.city)}
          />
        </div>
        <div className="form-row">
          <label>座机号码：</label>
          <input
            type="text"
            name="landline"
            value={supplierInfo.landline}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label>传真号：</label>
          <input
            type="text"
            name="fax"
            value={supplierInfo.fax}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label>邮箱：</label>
          <input
            type="email"
            name="email"
            value={supplierInfo.email}
            onChange={handleInputChange}
            required
          />
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

      <button onClick={handleSave} className="save-button">保存</button>
      <p className="last-updated">最后更新：2021/5/3</p>
    </div>
  );
};

export default SupplierInfoPage;
