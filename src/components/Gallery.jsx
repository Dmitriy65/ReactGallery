import React, { Component } from "react";
import { database, storage } from "../utils/firebase";
import ImageUpload from "./ImageUpload";
import Image from "./Image";

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      needUpdate: true
    };
  }

  handleUpdate = needUpdate => {
    if (needUpdate) this.setState(() => ({ needUpdate: true }));
  };

  componentDidMount = () => {
    this.getImagesFromDatabase();
  };

  componentDidUpdate = () => {
    if (this.state.needUpdate) {
      this.getImagesFromDatabase();
    }
  };

  getImagesFromDatabase = () => {
    database.ref("images/").on("value", snapshot => {
      const images = [];
      snapshot.forEach(item => {
        images.push(item.val());
      });
      this.setState({
        images: [...images],
        loading: false,
        needUpdate: false
      });
    });
  };

  deleteImage = async name => {
    const { url } = this.state.images.find(image => image.name === name);
    await storage.refFromURL(url).delete();
    database.ref(`images/${name}`).remove();
  };

  render() {
    const images = this.state.images.map((image, index) => (
      <Image key={index} image={image} deleteImage={this.deleteImage} />
    ));

    if (this.state.loading) {
      return (
        <main>
          <ImageUpload handleUpdate={this.handleUpdate} />
          <div>Загрузка картинок в процессе...</div>
        </main>
      );
    } else if (!this.state.loading && images.length) {
      return (
        <main>
          <ImageUpload handleUpdate={this.handleUpdate} />
          <div>{images}</div>;
        </main>
      );
    }
    return (
      <main>
        <ImageUpload handleUpdate={this.handleUpdate} />
        <div>Nothing...</div>
      </main>
    );
  }
}

export default Gallery;
