import React from "react";

const List = ({
  data = [],
  listClassName = "",
  renderItem,
  renderEmpty = <p>List is empty</p>,
}) => {
  return data && data.length ? (
    <ul className={listClassName}>
      {data.map((item, i) => (
        <li key={i}>{renderItem(item, i)}</li>
      ))}
    </ul>
  ) : (
    renderEmpty
  );
};

export default List;
