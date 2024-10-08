import { useState, useEffect } from "react";
import { useAuth } from "@/api/useAuth";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Contact {
  name: string;
  email: string;
}

function ContactList() {
  const { currentUser, getContact, contacts, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getContact();
  }, [getContact]);

  const handleSelectContact = (contact: Contact) => {
    navigate(`/chat/${contact.email}`);
  };

  const filteredContacts = contacts.filter(
    (contact) => contact.email !== currentUser?.user?.email
  );

  return (
    <div className="h-full w-full p-6 bg-white overflow-y-auto shadow-md">
      <ArrowLeft
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white mb-8"
      />
      <div className="mt-6">
        {filteredContacts.map((contact: Contact) => (
          <div
            key={contact.email}
            onClick={() => handleSelectContact(contact)}
            className="flex justify-between items-center p-3 border-b hover:bg-gray-100 cursor-pointer transition duration-200"
          >
            <div>
              <span className="font-semibold">{contact.name}</span>
              <div className="text-gray-600 text-sm">{contact.email}</div>
            </div>
            <span className="text-gray-500">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactList;
