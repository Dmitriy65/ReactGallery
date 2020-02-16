import React from "react";

const Container = {
  display: "inline-block",
  width: "350px",
  height: "400px",
  margin: "20px 25px",
  textAlign: "center",
  borderColor: "#008a77",
  borderStyle: "solid",
  padding: "5px"
};

const h1 = {
  textAlign: "center",
  color: "orange",
  fontSize: "15px"
};

function Image(props) {
  return (
    <div style={Container}>
      <h1 style={h1}>{props.image.name}</h1>
      {
        <img
          width="330px"
          height="330px"
          src={props.image.url}
          alt={props.image.name}
        ></img>
      }
      <button onClick={() => props.deleteImage(props.image.name)}>
        Delete this image
      </button>
    </div>
  );
}

export default Image;
