import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import PropTypes from "prop-types";
import "./style.css";
import { Redirect } from "react-router-dom";
import { logout, update } from "../actions/authActions";
import { buttonReset, isLoading } from "../actions/uiActions";
import axios from 'axios';

export class Profile extends Component {
  static propTypes = {
    button: PropTypes.bool,
    authState: PropTypes.object.isRequired,
    buttonReset: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };

  onLogout = (e) => {
    e.preventDefault();
    this.props.buttonReset();
    this.props.logout();
  };

  handleImpageInput = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    this.setState({file})
    const reader = new FileReader();

    reader.onloadend = () => {
      this.convertToBase64(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
      const fileType = file.type;
      const fileName = file.name;
      this.setState({fileType});
      this.setState({fileName});
    }
  };

  convertToBase64 = (image) => {
    const imageBase64 = image.split(",")[1];
    this.setState({imageBase64});
  };

  onSubmit = async (e) => {
    e.preventDefault();
    if (this.state.file) {
      const requestBody = {
        image: `data:${this.state.fileType};base64,${this.state.imageBase64}`,
        imageName: this.state.fileName,
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/uploadProfile`, requestBody);
      if (response.data.url) {
        const profile = response.data.url;
        const key = response.data.key;
        const id = this.props.authState.user.id;
        const user = { profile, key, id };
        this.props.isLoading();
        this.props.update(user);
      }
    }
  };

  render() {
    if (!this.props.authState.isAuthenticated) {
      return <Redirect to="/" />;
    }

    const { user } = this.props.authState;

    return (
      <div className="container">
        <div className="main">
          <Card>
            <CardBody>
              <CardTitle>
                <div>
                  <img
                    src={user?.key ? user.key : user.profile}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <h1>
                  {user ? `Welcome, ${user.name}` : ""}{" "}
                  <span role="img" aria-label="party-popper">
                    🎉{" "}
                  </span>{" "}
                </h1>
              </CardTitle>
              <br />
              <CardSubtitle>
                <h5>
                  {" "}
                  You are now Logged In{" "}
                  <span role="img" aria-label="clap">
                    👏{" "}
                  </span>
                </h5>
              </CardSubtitle>
              <br />
              <Button size="lg" onClick={this.onLogout} color="primary">
                Logout
              </Button>
              <Form onSubmit={this.onSubmit} style={{ marginTop: "20px" }}>
                <FormGroup>
                  <Label for="file">Upload Profile Picture</Label>
                  <Input
                    type="file"
                    name="file"
                    id="file"
                    size="lg"
                    placeholder="Choose File"
                    className="mb-3"
                    style={{ backgroundColor: "dodgerblue" }}
                    onChange={this.handleImpageInput}
                  />
                  <Button
                    size="lg"
                    style={{ marginLeft: "10px" }}
                    color="primary"
                  >
                    Update Profile Picture
                  </Button>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  //Maps state to redux store as props
  button: state.ui.button,
  authState: state.auth,
});

export default connect(mapStateToProps, {
  logout,
  buttonReset,
  update,
  isLoading,
})(Profile);
