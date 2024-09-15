import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './QualificationPage.css';

const QualificationPage = () => {
  const [qualificationData, setQualificationData] = useState({
    qualificationType: '',
    companyEstablishmentDate: '',
    registeredCapital: '',
    totalEmployees: '',
    companyArea: '',
    documents: {
      businessLicense: null,
      safetyCertificate: null,
      hazardousCertificate: null,
      other: null,
    },
  });

  // 获取认证令牌
  const token = localStorage.getItem('token'); // 确保登录后将令牌存储在 localStorage

  // 添加 useEffect，在组件加载时获取资质信息
  useEffect(() => {
    const fetchQualificationInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/qualifications', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch qualification info');
          return;
        }

        const data = await response.json();
        if (data) {
          // 将获取到的数据填充到状态中
          setQualificationData({
            qualificationType: data.qualification_type || '',
            companyEstablishmentDate: data.company_establishment_date
              ? data.company_establishment_date.split('T')[0] // 处理日期格式
              : '',
            registeredCapital: data.registered_capital || '',
            totalEmployees: data.total_employees || '',
            companyArea: data.company_area || '',
            documents: {
              businessLicense: null,
              safetyCertificate: null,
              hazardousCertificate: null,
              other: null,
            },
          });

          // 处理已上传的文件
          const files = data.files || {};
          const documents = {};

          if (files.business_license && files.business_license.length > 0) {
            documents.businessLicense = files.business_license[0];
          }
          if (files.production_safety_certificate && files.production_safety_certificate.length > 0) {
            documents.safetyCertificate = files.production_safety_certificate[0];
          }
          if (files.hazardous_production_license && files.hazardous_production_license.length > 0) {
            documents.hazardousCertificate = files.hazardous_production_license[0];
          }
          if (files.other_documents && files.other_documents.length > 0) {
            documents.other = files.other_documents[0];
          }

          setQualificationData((prevData) => ({
            ...prevData,
            documents: {
              ...prevData.documents,
              ...documents,
            },
          }));
        }
      } catch (error) {
        console.error('Error fetching qualification info:', error);
      }
    };

    fetchQualificationInfo();
  }, [token]);

  const onDrop = (acceptedFiles, fieldName) => {
    setQualificationData((prevData) => ({
      ...prevData,
      documents: {
        ...prevData.documents,
        [fieldName]: acceptedFiles.length > 0 ? acceptedFiles[0] : null,
      },
    }));
  };

  const {
    getRootProps: getBusinessLicenseProps,
    getInputProps: getBusinessLicenseInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'businessLicense'),
    multiple: false,
  });

  const {
    getRootProps: getSafetyCertificateProps,
    getInputProps: getSafetyCertificateInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'safetyCertificate'),
    multiple: false,
  });

  const {
    getRootProps: getHazardousCertificateProps,
    getInputProps: getHazardousCertificateInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'hazardousCertificate'),
    multiple: false,
  });

  const {
    getRootProps: getOtherProps,
    getInputProps: getOtherInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 'other'),
    multiple: false,
  });

  const handleSave = async () => {
    console.log('保存资格证照信息:', qualificationData);

    try {
      const formData = new FormData();
      formData.append('qualification_type', qualificationData.qualificationType);
      formData.append('company_establishment_date', qualificationData.companyEstablishmentDate);
      formData.append('registered_capital', qualificationData.registeredCapital);
      formData.append('total_employees', qualificationData.totalEmployees);
      formData.append('company_area', qualificationData.companyArea);

      // 添加文件到 formData
      if (
        qualificationData.documents.businessLicense &&
        qualificationData.documents.businessLicense instanceof File
      ) {
        formData.append('business_license', qualificationData.documents.businessLicense);
      }
      if (
        qualificationData.documents.safetyCertificate &&
        qualificationData.documents.safetyCertificate instanceof File
      ) {
        formData.append('production_safety_certificate', qualificationData.documents.safetyCertificate);
      }
      if (
        qualificationData.documents.hazardousCertificate &&
        qualificationData.documents.hazardousCertificate instanceof File
      ) {
        formData.append('hazardous_production_license', qualificationData.documents.hazardousCertificate);
      }
      if (
        qualificationData.documents.other &&
        qualificationData.documents.other instanceof File
      ) {
        formData.append('other_documents', qualificationData.documents.other);
      }

      const response = await fetch('http://localhost:5000/api/qualifications', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // 添加认证令牌
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        throw new Error(
          `Failed to save qualification info: ${response.statusText || 'Unknown error'}`
        );
      }

      const result = await response.json();
      console.log('Qualification saved successfully:', result);
      alert('资质信息保存成功！');
    } catch (error) {
      console.error('Error saving qualification info:', error);
      alert(`Error saving qualification info: ${error.message}`);
    }
  };

  return (
    <div className="qualification-container">
      <h2>资质证照</h2>
      <form className="qualification-form">
        {/* 基本信息 */}
        <div className="form-group">
          <label>经营资质类型*</label>
          <input
            type="text"
            value={qualificationData.qualificationType}
            onChange={(e) =>
              setQualificationData({ ...qualificationData, qualificationType: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>公司成立时间*</label>
          <input
            type="date"
            value={qualificationData.companyEstablishmentDate}
            onChange={(e) =>
              setQualificationData({ ...qualificationData, companyEstablishmentDate: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>注册资本*</label>
          <input
            type="number"
            value={qualificationData.registeredCapital}
            onChange={(e) =>
              setQualificationData({ ...qualificationData, registeredCapital: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>员工总数*</label>
          <input
            type="number"
            value={qualificationData.totalEmployees}
            onChange={(e) =>
              setQualificationData({ ...qualificationData, totalEmployees: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>公司占地面积*</label>
          <input
            type="number"
            value={qualificationData.companyArea}
            onChange={(e) =>
              setQualificationData({ ...qualificationData, companyArea: e.target.value })
            }
            required
          />
        </div>

        {/* 文件上传区 - 经营许可证 */}
        <div className="file-upload-section">
          <h4>经营许可证</h4>
          <div {...getBusinessLicenseProps({ className: 'dropzone' })}>
            <input {...getBusinessLicenseInputProps()} />
            <button type="button">上传文件</button>
          </div>
          {qualificationData.documents.businessLicense && (
            <div className="file-preview">
              <span>
                {qualificationData.documents.businessLicense.name ||
                  qualificationData.documents.businessLicense.file_name}
              </span>
              <button type="button" onClick={() => onDrop([], 'businessLicense')}>
                删除
              </button>
              {/* 如果是已上传的文件，提供下载链接 */}
              {qualificationData.documents.businessLicense.file_path && (
                <a
                  href={`http://localhost:5000/${qualificationData.documents.businessLicense.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  查看文件
                </a>
              )}
            </div>
          )}
        </div>

        {/* 文件上传区 - 安全生产许可证 */}
        <div className="file-upload-section">
          <h4>安全生产许可证</h4>
          <div {...getSafetyCertificateProps({ className: 'dropzone' })}>
            <input {...getSafetyCertificateInputProps()} />
            <button type="button">上传文件</button>
          </div>
          {qualificationData.documents.safetyCertificate && (
            <div className="file-preview">
              <span>
                {qualificationData.documents.safetyCertificate.name ||
                  qualificationData.documents.safetyCertificate.file_name}
              </span>
              <button type="button" onClick={() => onDrop([], 'safetyCertificate')}>
                删除
              </button>
              {qualificationData.documents.safetyCertificate.file_path && (
                <a
                  href={`http://localhost:5000/${qualificationData.documents.safetyCertificate.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  查看文件
                </a>
              )}
            </div>
          )}
        </div>

        {/* 文件上传区 - 危险品生产或经营许可证 */}
        <div className="file-upload-section">
          <h4>危险品生产或经营许可证</h4>
          <div {...getHazardousCertificateProps({ className: 'dropzone' })}>
            <input {...getHazardousCertificateInputProps()} />
            <button type="button">上传文件</button>
          </div>
          {qualificationData.documents.hazardousCertificate && (
            <div className="file-preview">
              <span>
                {qualificationData.documents.hazardousCertificate.name ||
                  qualificationData.documents.hazardousCertificate.file_name}
              </span>
              <button type="button" onClick={() => onDrop([], 'hazardousCertificate')}>
                删除
              </button>
              {qualificationData.documents.hazardousCertificate.file_path && (
                <a
                  href={`http://localhost:5000/${qualificationData.documents.hazardousCertificate.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  查看文件
                </a>
              )}
            </div>
          )}
        </div>

        {/* 文件上传区 - 其他 */}
        <div className="file-upload-section">
          <h4>其他</h4>
          <div {...getOtherProps({ className: 'dropzone' })}>
            <input {...getOtherInputProps()} />
            <button type="button">上传文件</button>
          </div>
          {qualificationData.documents.other && (
            <div className="file-preview">
              <span>
                {qualificationData.documents.other.name ||
                  qualificationData.documents.other.file_name}
              </span>
              <button type="button" onClick={() => onDrop([], 'other')}>
                删除
              </button>
              {qualificationData.documents.other.file_path && (
                <a
                  href={`http://localhost:5000/${qualificationData.documents.other.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  查看文件
                </a>
              )}
            </div>
          )}
        </div>

        <button type="button" className="save-button" onClick={handleSave}>
          保存
        </button>
      </form>
    </div>
  );
};

export default QualificationPage;
