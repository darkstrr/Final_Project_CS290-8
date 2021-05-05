import React from "react";

export function ListItem(props) {
  return <li>{props.name} </li>;
}

//Chat message
export function Text(props) {
  return <li>{props.msg} </li>;
}
