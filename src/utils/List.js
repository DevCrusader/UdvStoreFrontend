import React from "react";

const List = ({
  data = [],
  listClassName = "",
  renderItem,
  renderEmpty = <p>List is empty</p>,
  keyByItemId = "",
}) => {
  return data && data.length ? (
    <ul className={listClassName}>
      {data.map((item, i) => (
        <li key={keyByItemId ? item[keyByItemId] : i}>
          {renderItem(item, i)}
        </li>
      ))}
    </ul>
  ) : (
    renderEmpty
  );
};

export default List;
