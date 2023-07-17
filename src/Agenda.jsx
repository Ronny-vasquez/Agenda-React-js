import React, { useState, useEffect } from "react";
import "./css/App.css";

function ContactForm() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    getContacts();
  }, []);

  function getContacts() {
    fetch("http://www.raydelto.org/agenda.php")
      .then((response) => response.json())
      .then((data) => {
        setContacts(data);
        setFilteredContacts(data);
      })
      .catch((error) =>
        console.error("Error al obtener los contactos:", error)
      );
  }

  function saveContact() {
    const newContact = {
      nombre: firstName,
      apellido: lastName,
      telefono: phone,
    };

    fetch("http://www.raydelto.org/agenda.php", {
      method: "POST",
      body: JSON.stringify(newContact),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.resultado === "OK") {
          getContacts();
          resetForm();
        } else {
          console.error("Error al guardar el contacto:", data.mensaje);
        }
      })
      .catch((error) => console.error("Error al guardar el contacto:", error));
  }

  function resetForm() {
    setFirstName("");
    setLastName("");
    setPhone("");
  }

  function handleFilterChange(event) {
    const { value } = event.target;
    setFilterText(value);

    const filtered = contacts.filter(
      (contact) =>
        contact.nombre.toLowerCase().includes(value.toLowerCase()) ||
        contact.apellido.toLowerCase().includes(value.toLowerCase()) ||
        contact.telefono.includes(value)
    );
    setFilteredContacts(filtered);
  }

  return (
    <div className="container">
      <h1>Agenda De Contactos</h1>
      <form className="form" onSubmit={saveContact}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Nombre:"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Apellido:"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Teléfono:"
        />
        <button type="submit">Agregar contacto</button>
      </form>

      <label for="">
        Search :{" "}
        <input
          className="Filtro"
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Filtrar"
        />
      </label>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact, index) => (
            <tr key={index}>
              <td>{contact.nombre}</td>
              <td>{contact.apellido}</td>
              <td>{contact.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContactForm;
