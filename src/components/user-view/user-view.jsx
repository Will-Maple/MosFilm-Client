import { useEffect, useState } from 'react';
import { Form, Button, Modal } from "react-bootstrap";
import { useParams, Link } from "react-router";
import './user-view.scss';
import { Next } from 'react-bootstrap/esm/PageItem';

export const UserView = ({ user, token, onLoggedOut }) => {
  console.log({ user });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateParams = user.Username;
  const defaultUsername = user.Username;
  const defualtEmail = user.Email;
  const [username, setUsername] = useState("");
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const initiateSubmit = () => {

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    };

    fetch(`https://mosfilm-api.onrender.com/users/${updateParams}`, {
      method: "put",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "Application/json"
      }
    }).then((response) => {
      if (response.ok) {
        alert("Update successful")
        onLoggedOut()
      } else {
        alert("Update failed");
      }
    })
      .catch((e) => {
        alert("Something went wrong");
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (firstPassword === secondPassword) {
      setPassword(firstPassword);
      initiateSubmit();
    } else {
      return (alert("Passwords do not Match!"))
    }
  };

  return (<div>
    <div>
      User: {user.Username} --- Email: {user.Email} --- Birthday: {user.Birthday}
    </div>
    <Button variety="primary" onClick={handleShow}>Update User Details</Button>
    <Link to={`/`}>
      <Button className="back-button">Back</Button>
    </Link>

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              placeholder={defaultUsername}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength="5"
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>New Password:</Form.Label>
            <Form.Control
              type="password"
              value={firstPassword}
              onChange={(e) => setFirstPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Retype Password:</Form.Label>
            <Form.Control
              type="password"
              value={secondPassword}
              onChange={(e) => setSecondPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder={defualtEmail}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBirthday">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </Form.Group>
          <Button varient="Primary" bsPrefix="submit-signup" type="submit">Submit</Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button varient="primary" onClick={handleClose}>Exit</Button>
      </Modal.Footer>
    </Modal>
  </div>
  )
};