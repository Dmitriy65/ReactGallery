import React, { Component } from "react";
import { storage, database } from "../utils/firebase";

class ImageUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      name: "",
      loadingStatus: ""
    };
  }

  handleFileChange = evt => {
    const file = evt.target.files[0];
    if (file && file.type.includes("image")) {
      const image = evt.target.files[0];
      this.setState(() => ({ image }));
    } else {
      alert("You can upload only images!");
      evt.target.value = "";
    }
  };

  handleNameChange = evt => {
    this.setState({ name: evt.target.value });
  };

  getUploadingProcent = snapshot => {
    return Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
  };

  handleUpload = () => {
    const { image } = this.state;

    if (!image || !this.state.name) {
      alert("Please, enter name or upload correct image");
      return;
    }

    const inputName = this.state.name;

    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {
        const procent = this.getUploadingProcent(snapshot);
        this.setState(() => ({
          loadingStatus: `Uploading - ${procent}%`
        }));
      },
      error => {
        console.log(error);
      },
      async () => {
        const url = await storage
          .ref("images/")
          .child(image.name)
          .getDownloadURL();

        database
          .ref(`images/${inputName}`)
          .set({ name: inputName, url }, error => {
            if (error) {
              console.log(error);
            } else {
              this.props.handleUpdate(true);
            }
          });
      }
    );

    this.setState(() => ({
      image: null,
      name: ""
    }));
  };
  render() {
    return (
      <div style={ImageUploader}>
        <span>{this.state.loadingStatus}</span>
        <br />
        <input
          style={FileLoader}
          type="file"
          onChange={this.handleFileChange}
        />
        <br />
        <label>
          Image Title:
          <input
            type="text"
            value={this.state.name}
            onChange={this.handleNameChange}
          />
        </label>
        <br />
        <button style={UploadButton} onClick={this.handleUpload}>
          Upload
        </button>
      </div>
    );
  }
}

export default ImageUpload;

const ImageUploader = {
  backgroundColor: "#7BC8A1"
};

const UploadButton = {
  fontWeight: "700",
  color: "white",
  padding: "10px",
  textDecoration: "none",
  borderRadius: "3px",
  background: "#D77206",
  transition: "0.2s"
};

const FileLoader = {
  width: "100%",
  padding: "12px 20px",
  boxSizing: "border-box"
};
