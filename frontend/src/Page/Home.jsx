import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import "../App.css";
import Header from "../Component/Header";
import Footer from "../Component/Footer";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicine, setMedicine] = useState("");
  const [time, setTime] = useState("");

  const userData =JSON.parse(localStorage.getItem("userData"));

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMedicineChange = (e) => {
    setMedicine(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!medicine || !time) {
      toast.error("All fields are required!");
      return;
    }

    const reminder = {
      medicine,
      time,
      email: userData.email,
      phone: userData.phone,
    };

    try {
      axios.post("http://localhost:5000/reminder", reminder);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <Header />
      </div>

      <div className="body-container">
        <div className="head-text">
          <h1>Never forget your dose of medication again</h1>
          <button onClick={openModal} className="head-text">Set reminder now</button>
        </div>
        <div className="left">
          <span>Your Remainders:</span>
          <div className="box-container">
            <p>Reminders...</p>
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>

      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Set Remainder</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column">
          <label>Medicine</label>
          <input type="text" onChange={handleMedicineChange} />
          <label>Time</label>
          <input type="text" onChange={handleTimeChange} />
        </Modal.Body>
        <Modal.Footer>
          <button onClick={closeModal}>Close</button>
          <button onClick={handleSubmit}>Submit</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
