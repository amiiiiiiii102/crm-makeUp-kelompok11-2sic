import React, { useState } from "react";

const initialCustomers = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@mail.com",
    phone: "081234567890",
    active: true,
  },

  {
    id: 2,
    name: "Siti Aminah",
    email: "siti@mail.com",
    phone: "089876543210",
    active: false,
  },

  {
    id: 3,
    name: "Andi Wijaya",
    email: "andi@mail.com",
    phone: "081299988877",
    active: true,
  },
];

export default function Pelanggan() {
  const [customers, setCustomers] = useState(initialCustomers);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    active: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddCustomer = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Semua field wajib diisi!");
    }
  };
}
