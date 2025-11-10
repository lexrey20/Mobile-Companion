import React, { useState } from "react";
import { UserPlus, User, BookOpen, Pencil, Trash2 } from "lucide-react";

type Country = {
  name: string;
  code: string;
  length: number;
  pattern?: RegExp;
};

type ContactType = {
  name: string;
  phone: string;
};

const countries: Country[] = [
  { 
    name: "Philippines", 
    code: "+63", 
    length: 10,
    pattern: /^[9]\d{9}$/ // Must start with 9 and be 10 digits total
  },
  { name: "United States", code: "+1", length: 10 },
  { name: "United Kingdom", code: "+44", length: 10 },
];

// Mock phonebook contacts
const phonebook: ContactType[] = [
  { name: "Juan Dela Cruz", phone: "9123456789" },
  { name: "Maria Santos", phone: "9123456790" },
  { name: "John Smith", phone: "1234567890" },
  { name: "Alice Brown", phone: "9876543210" },
];

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [showPhonebook, setShowPhonebook] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  // Format phone number for display (remove leading 0 if present)
  const formatPhoneForDisplay = (phone: string): string => {
    if (selectedCountry.code === "+63" && phone.startsWith("0")) {
      return phone.substring(1);
    }
    return phone;
  };

  // Format phone number for storage (ensure proper format)
  const formatPhoneForStorage = (phone: string): string => {
    let formatted = phone.replace(/\D/g, "");
    
    // For Philippines: remove leading 0 if present and ensure it starts with 9
    if (selectedCountry.code === "+63") {
      if (formatted.startsWith("0")) {
        formatted = formatted.substring(1);
      }
      // Ensure it's exactly 10 digits starting with 9
      if (formatted.length > 10) {
        formatted = formatted.substring(0, 10);
      }
    } else {
      // For other countries, just take the required length
      if (formatted.length > selectedCountry.length) {
        formatted = formatted.substring(0, selectedCountry.length);
      }
    }
    
    return formatted;
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!newName.trim()) {
      newErrors.name = "Contact name is required";
    }

    if (!newPhone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const formattedPhone = formatPhoneForStorage(newPhone);
      
      if (selectedCountry.code === "+63") {
        // Philippines validation
        if (formattedPhone.length !== 10) {
          newErrors.phone = "Phone number must be 10 digits (excluding +63)";
        } else if (!formattedPhone.startsWith("9")) {
          newErrors.phone = "Philippines numbers must start with 9";
        }
      } else {
        // Other countries validation
        if (formattedPhone.length !== selectedCountry.length) {
          newErrors.phone = `Phone number must be exactly ${selectedCountry.length} digits`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addContact = (name: string, phone: string) => {
    if (contacts.length >= 3) return alert("You can only add up to 3 contacts.");
    
    const formattedPhone = formatPhoneForStorage(phone);
    const fullPhone = `${selectedCountry.code} ${formattedPhone}`;
    
    setContacts([...contacts, { name, phone: fullPhone }]);
    resetForm();
  };

  const updateContact = () => {
    if (editIndex === null) return;
    
    if (!validateForm()) return;

    const formattedPhone = formatPhoneForStorage(newPhone);
    const fullPhone = `${selectedCountry.code} ${formattedPhone}`;
    
    const updatedContacts = [...contacts];
    updatedContacts[editIndex] = { name: newName, phone: fullPhone };
    setContacts(updatedContacts);
    resetForm();
  };

  const handleAddContact = () => {
    if (!validateForm()) return;
    
    const formattedPhone = formatPhoneForStorage(newPhone);
    addContact(newName, formattedPhone);
  };

  const handlePhonebookSelect = (contact: ContactType) => {
    if (contacts.length >= 3) return alert("You can only add up to 3 contacts.");
    
    // Format the phone number from phonebook to match selected country
    let formattedPhone = contact.phone.replace(/\D/g, "");
    
    if (selectedCountry.code === "+63" && formattedPhone.startsWith("0")) {
      formattedPhone = formattedPhone.substring(1);
    }
    
    const fullPhone = `${selectedCountry.code} ${formattedPhone}`;
    addContact(contact.name, fullPhone);
    setShowPhonebook(false);
  };

  const removeContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  const startEdit = (index: number) => {
    const contact = contacts[index];
    setEditIndex(index);
    setNewName(contact.name);
    
    // Extract phone number without country code
    const phoneWithoutCode = contact.phone.replace(/\+\d+\s/, "");
    setNewPhone(phoneWithoutCode);
    setErrors({}); // Clear errors when editing
  };

  const resetForm = () => {
    setNewName("");
    setNewPhone("");
    setEditIndex(null);
    setErrors({});
  };

  const cancelEdit = () => {
    resetForm();
  };

  const handlePhoneChange = (value: string) => {
    // Allow only digits and limit based on country
    let digits = value.replace(/\D/g, "");
    
    if (selectedCountry.code === "+63") {
      // Allow up to 11 digits for Philippines (including leading 0)
      if (digits.length > 11) {
        digits = digits.substring(0, 11);
      }
    } else {
      // For other countries, use their specified length
      if (digits.length > selectedCountry.length) {
        digits = digits.substring(0, selectedCountry.length);
      }
    }
    
    setNewPhone(digits);
    if (errors.phone) setErrors({ ...errors, phone: undefined });
  };

  const getPhonePlaceholder = (): string => {
    if (selectedCountry.code === "+63") {
      return "Phone number *";
    }
    return `Phone number * (${selectedCountry.length} digits)`;
  };

  const getMaxLength = (): number => {
    if (selectedCountry.code === "+63") {
      return 11; // Allow 0 + 10 digits for Philippines
    }
    return selectedCountry.length;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 h-full pb-24">
      {/* Spacing below main header */}
      <div className="w-full mb-4 relative bg-blue-50 border border-blue-200 rounded-xl p-3 shadow-sm">
        <UserPlus className="w-6 h-6 text-blue-600 absolute top-4 left-4" />
        <div className="ml-10">
          <p className="text-blue-800 font-semibold text-sm sm:text-base">
            Add up to 3 emergency contacts
          </p>
          <p className="text-blue-700 text-xs sm:text-sm">
            Manually add contacts or select from your phonebook
          </p>
        </div>
      </div>

      {/* Contact List */}
      <div className="w-full bg-white p-4 rounded-xl shadow-md mb-4">
        {contacts.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No contacts added yet</p>
        ) : (
          contacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between border-b last:border-none py-2">
              <div className="flex items-center space-x-3">
                <User className="text-blue-600" />
                <div>
                  <p className="font-medium text-gray-700">{c.name}</p>
                  <p className="text-gray-500 text-sm">{c.phone}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => startEdit(i)} className="text-blue-600">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => removeContact(i)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Contact */}
      {contacts.length < 3 && (
        <div className="w-full bg-white p-4 rounded-xl shadow-md">
          <h3 className="font-semibold mb-2 text-gray-700 flex items-center justify-between">
            {editIndex !== null ? "Edit Contact" : "Add Contact"}
            {editIndex === null && (
              <button
                onClick={() => setShowPhonebook(true)}
                className="p-1 bg-blue-100 rounded-full hover:bg-blue-200 transition"
                title="Select from phonebook"
              >
                <BookOpen className="w-5 h-5 text-blue-600" />
              </button>
            )}
          </h3>

          <div className="mb-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Contact name *"
              className={`w-full p-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <select
            value={selectedCountry.code}
            onChange={(e) => {
              const country = countries.find((c) => c.code === e.target.value);
              if (country) {
                setSelectedCountry(country);
                setNewPhone(""); // Clear phone when country changes
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }
            }}
            className="w-full mb-2 p-2 border border-gray-300 rounded-lg"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>

          <div className="mb-3">
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder={getPhonePlaceholder()}
              maxLength={getMaxLength()}
              className={`w-full p-2 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            {selectedCountry.code === "+63" && (
              <p className="text-gray-500 text-xs mt-1">
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {editIndex !== null && (
              <button
                onClick={cancelEdit}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
            <button
              onClick={editIndex !== null ? updateContact : handleAddContact}
              className={`flex items-center justify-center flex-1 py-2 rounded-lg transition ${
                editIndex !== null 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {editIndex !== null ? "Update Contact" : "Add Contact"}
            </button>
          </div>
        </div>
      )}

      {/* Phonebook Modal */}
      {showPhonebook && (
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-80 max-h-[60%] overflow-y-auto rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold mb-3 text-gray-700">Select from Phonebook</h3>
            {phonebook.map((c, i) => (
              <button
                key={i}
                onClick={() => handlePhonebookSelect(c)}
                className="w-full text-left p-2 border-b last:border-none hover:bg-gray-100 rounded"
              >
                <div className="flex items-center space-x-2">
                  <User className="text-blue-600" />
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-gray-500 text-sm">{c.phone}</p>
                  </div>
                </div>
              </button>
            ))}

            <button
              onClick={() => setShowPhonebook(false)}
              className="mt-3 w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;