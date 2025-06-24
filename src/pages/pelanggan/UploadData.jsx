import React, { useState, useContext, useMemo } from 'react';
import { Upload, CheckCircle, AlertCircle, X, Users, FileText } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { PelangganContext } from './PelangganContext';
import { supabase } from '../../Supabase';
import { generateDefaultImage } from '../../generateDefaultImage';

const UploadData = () => {
  const { pelanggan, setPelanggan } = useContext(PelangganContext);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadedData, setUploadedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  // Definisi kolom yang diharapkan untuk data pelanggan
  const expectedColumns = [
    'nama', 'email', 'nohp', 'alamat', 'kategori', 'tanggalbergabung'
  ];

  const optionalColumns = [
    'fotoprofil', 'totalbelanja', 'totalpesanan'
  ];

  // 🔧 FIX: Pindahkan useMemo ke level komponen
  const existingEmails = useMemo(() => 
    new Set(pelanggan.map(item => item.email?.trim().toLowerCase())), 
    [pelanggan]
  );

  // Fungsi untuk membersihkan nama header
  const cleanHeader = (header) => {
    return header.toString().trim().toLowerCase().replace(/\s+/g, '_');
  };

  // 🔧 FIX: Fungsi validasi tanggal yang lengkap
  const isValidDate = (dateString) => {
    if (!dateString || dateString.toString().trim() === '') return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && date.getFullYear() > 1900;
  };

  // Fungsi validasi kolom
  const validateColumns = (headers) => {
    const cleanedHeaders = headers.map(cleanHeader);
    const missingColumns = expectedColumns.filter(col => !cleanedHeaders.includes(col));
    
    if (missingColumns.length > 0) {
      return {
        isValid: false,
        message: `Kolom yang wajib ada tidak ditemukan: ${missingColumns.join(', ')}`
      };
    }
    
    return { isValid: true };
  };

  // 🔧 FIX: Fungsi validasi data yang diperbaiki
  const validateData = (data) => {
    const errors = [];
    
    data.forEach((row, index) => {
      const rowNumber = index + 2;
      
      // Validasi nama (wajib)
      if (!row.nama || row.nama.toString().trim() === '') {
        errors.push(`Baris ${rowNumber}: Nama tidak boleh kosong`);
      }
      
      // Validasi email (wajib dan format)
      if (!row.email || row.email.toString().trim() === '') {
        errors.push(`Baris ${rowNumber}: Email tidak boleh kosong`);
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row.email.toString().trim())) {
          errors.push(`Baris ${rowNumber}: Format email tidak valid`);
        }
      }
      
      // Validasi telepon (wajib)
      if (!row.nohp || row.nohp.toString().trim() === '') {
        errors.push(`Baris ${rowNumber}: Telepon tidak boleh kosong`);
      }
      
      // Validasi alamat (wajib)
      if (!row.alamat || row.alamat.toString().trim() === '') {
        errors.push(`Baris ${rowNumber}: Alamat tidak boleh kosong`);
      }
      
      // 🔧 FIX: Perbaiki typo "Kategori"
      if (!row.kategori || row.kategori.toString().trim() === '') {
        errors.push(`Baris ${rowNumber}: Kategori tidak boleh kosong`);
      }
      
      // 🔧 FIX: Validasi tanggal bergabung yang lengkap
      if (!row.tanggalbergabung || row.tanggalbergabung.toString().trim() === '') {
        errors.push(`Baris ${rowNumber}: Tanggal bergabung tidak boleh kosong`);
      } else if (!isValidDate(row.tanggalbergabung)) {
        errors.push(`Baris ${rowNumber}: Format tanggal bergabung tidak valid`);
      }
    });
    
    return errors;
  };

  // Fungsi untuk memproses file CSV
  const processCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        delimitersToGuess: [',', ';', '\t'],
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error('Error parsing CSV: ' + results.errors[0].message));
            return;
          }

          const cleanedHeaders = results.meta.fields.map(cleanHeader);
          const cleanedData = results.data.map((row) => {
            const newRow = {};
            results.meta.fields.forEach((originalKey, i) => {
              const cleanedKey = cleanedHeaders[i];
              newRow[cleanedKey] = row[originalKey];
            });
            return newRow;
          });

          resolve({
            data: cleanedData,
            headers: cleanedHeaders
          });
        },
        error: (error) => {
          reject(new Error('Error reading CSV file: ' + error.message));
        }
      });
    });
  };

  // Fungsi untuk memproses file Excel
  const processExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            reject(new Error('File Excel harus memiliki minimal 2 baris (header + data)'));
            return;
          }
          
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          
          const processedData = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[cleanHeader(header)] = row[index] || '';
            });
            return obj;
          });
          
          resolve({
            data: processedData,
            headers: headers
          });
        } catch (error) {
          reject(new Error('Error processing Excel file: ' + error.message));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // 🔧 FIX: Tambahkan validasi ukuran file
  const validateFileSize = (file) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    return file.size <= MAX_FILE_SIZE;
  };

  // Handler untuk upload file
  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // 🔧 FIX: Validasi ukuran file
    if (!validateFileSize(selectedFile)) {
      setErrorMessage('File terlalu besar. Maksimal 10MB');
      return;
    }

    // Validasi tipe file
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
    if (!allowedTypes.includes(selectedFile.type) && !['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      setErrorMessage('Tipe file tidak didukung. Gunakan file CSV atau Excel (.xlsx/.xls)');
      return;
    }

    setFile(selectedFile);
    setUploadStatus('processing');
    setErrorMessage('');
    setValidationErrors([]);

    try {
      let result;
      
      if (selectedFile.type === 'text/csv' || fileExtension === 'csv') {
        result = await processCSV(selectedFile);
      } else {
        result = await processExcel(selectedFile);
      }

      // Validasi kolom
      const columnValidation = validateColumns(result.headers);
      if (!columnValidation.isValid) {
        throw new Error(columnValidation.message);
      }

      // Validasi data
      const dataErrors = validateData(result.data);
      if (dataErrors.length > 0) {
        setValidationErrors(dataErrors);
        throw new Error(`Ditemukan ${dataErrors.length} error validasi data`);
      }

      setUploadedData(result.data);
      setUploadStatus('success');
      
    } catch (error) {
      setErrorMessage(error.message);
      setUploadStatus('error');
    }
  };

  // Handler untuk reset
  const handleReset = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadedData([]);
    setErrorMessage('');
    setValidationErrors([]);
  };

  // 🔧 FIX: Handler untuk menyimpan data yang diperbaiki
  const handleSaveData = async () => {
    try {
      setUploadStatus('processing'); // Loading state saat menyimpan

      // Filter data baru menggunakan useMemo yang sudah dipindahkan
      const newData = uploadedData
        .filter((item) => {
          const email = item.email?.trim().toLowerCase();
          return !existingEmails.has(email);
        })
        .map((item) => ({
          ...item,
          fotoprofil: item.fotoprofil || generateDefaultImage(item.nama),
        }));

      if (newData.length === 0) {
        setErrorMessage('File ini sudah pernah diupload. Tidak ada data baru yang ditambahkan.');
        setUploadStatus('error');
        return;
      }

      // Simpan ke Supabase
      const { data, error } = await supabase
        .from('pelanggan')
        .insert(newData)
        .select();

      if (error) {
        console.error('Gagal menyimpan ke Supabase:', error);
        setErrorMessage('Gagal menyimpan data ke Supabase: ' + error.message);
        setUploadStatus('error');
        return;
      }

      // Update context
      setPelanggan((prev) => [...data, ...prev]);

      // Reset form dan tampilkan pesan sukses
      setUploadStatus('idle');
      setErrorMessage('');
      alert(`Berhasil menyimpan ${data.length} data pelanggan baru ke Supabase!`);
      handleReset();
      
    } catch (error) {
      console.error('Gagal menyimpan:', error);
      setErrorMessage('Terjadi kesalahan saat menyimpan data: ' + error.message);
      setUploadStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <Users className="mr-2" />
          Upload Data Pelanggan
        </h2>
        <p className="text-gray-600">
          Upload file CSV atau Excel dengan data pelanggan. Pastikan file memiliki kolom yang sesuai.
        </p>
      </div>

      {/* Format Kolom yang Diharapkan */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Format Kolom yang Diharapkan:</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Kolom Wajib:</h4>
            <ul className="text-sm text-blue-600">
              {expectedColumns.map(col => (
                <li key={col} className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {col}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 mb-1">Kolom Opsional:</h4>
            <ul className="text-sm text-blue-600">
              {optionalColumns.map(col => (
                <li key={col} className="flex items-center">
                  <div className="w-3 h-3 mr-1 rounded-full border border-blue-400"></div>
                  {col}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        {uploadStatus === 'idle' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              id="fileInput"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-700 mb-2">
                Klik untuk upload file
              </span>
              <span className="text-sm text-gray-500">
                Mendukung format CSV, XLSX, XLS (Max: 10MB)
              </span>
            </label>
          </div>
        )}

        {uploadStatus === 'processing' && (
          <div className="border-2 border-blue-300 rounded-lg p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-blue-600 font-medium">Memproses file...</p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="border-2 border-red-300 rounded-lg p-6 bg-red-50">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="font-semibold text-red-800">Error Upload</h3>
            </div>
            <p className="text-red-700 mb-4">{errorMessage}</p>
            
            {validationErrors.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-red-800 mb-2">Detail Error:</h4>
                <div className="max-h-40 overflow-y-auto bg-white p-3 rounded border">
                  {validationErrors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600 mb-1">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={handleReset}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="border-2 border-green-300 rounded-lg p-6 bg-green-50">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="font-semibold text-green-800">Upload Berhasil</h3>
            </div>
            <p className="text-green-700 mb-4">
              Berhasil memproses {uploadedData.length} data pelanggan dari file "{file?.name}"
            </p>
            
            {/* Preview Data */}
            <div className="mb-4">
              <h4 className="font-medium text-green-800 mb-2">Preview Data (5 data pertama):</h4>
              <div className="bg-white rounded border overflow-hidden">
                <div className="overflow-x-auto max-h-60">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(uploadedData[0] || {}).map(key => (
                          <th key={key} className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedData.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-b">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2 text-gray-600">
                              {value?.toString() || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveData}
                className="cursor-pointer bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Simpan Data
              </button>
              <button
                onClick={handleReset}
                className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Upload Lagi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadData;