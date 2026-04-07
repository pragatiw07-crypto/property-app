import { useState } from "react";
import axios from "axios";

function App() {
  // 🔐 login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ➕ property states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // 📥 properties list
  const [properties, setProperties] = useState([]);

  // 🔐 LOGIN
  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      alert("Login successful 🔥");
    } catch (err) {
      console.log(err.response?.data);
      alert("Login failed ❌");
    }
  };

  // ➕ ADD PROPERTY
  const addProperty = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/properties/add",
        {
          title,
          price: Number(price),
          location,
          description
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      alert("Property added ✅");
      getMyProperties(); // refresh
    } catch (err) {
      console.log(err.response?.data);
      alert("Error adding property ❌");
    }
  };

  // 📥 GET MY PROPERTIES
  const getMyProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/properties/my",
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      setProperties(res.data);
    } catch (err) {
      console.log(err.response?.data);
      alert("Error fetching properties ❌");
    }
  };

  // 🗑 DELETE PROPERTY
  const deleteProperty = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      alert("Deleted ✅");
      getMyProperties();
    } catch (err) {
      console.log(err.response?.data);
      alert("Delete failed ❌");
    }
  };

  // ✏ UPDATE PROPERTY
  const updateProperty = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const newTitle = prompt("Enter new title:");
      const newPrice = prompt("Enter new price:");
      const newLocation = prompt("Enter new location:");
      const newDescription = prompt("Enter new description:");

      await axios.put(
        `http://localhost:5000/api/properties/${id}`,
        {
          title: newTitle,
          price: Number(newPrice),
          location: newLocation,
          description: newDescription
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      alert("Updated ✅");
      getMyProperties();
    } catch (err) {
      console.log(err.response?.data);
      alert("Update failed ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Login</button>

      <hr />

      <h2>Add Property</h2>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <br /><br />

      <input placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <br /><br />

      <input
        placeholder="Location"
        onChange={(e) => setLocation(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <br /><br />

      <button onClick={addProperty}>Add Property</button>

      <hr />

      <h2>My Properties</h2>

      <button onClick={getMyProperties}>Load My Properties</button>

      <ul>
        {properties.map((p) => (
          <li key={p._id}>
            {p.title} - ₹{p.price} - {p.location}

            <button onClick={() => deleteProperty(p._id)}>Delete</button>
            <button onClick={() => updateProperty(p._id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;