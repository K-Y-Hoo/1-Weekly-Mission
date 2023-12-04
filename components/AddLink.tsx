import React from "react";

const AddLink = ({ onClick, handleAddLinkValue }: AddLinkProps) => {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleAddLinkValue(e.target.value);
  }

  return (
    <form
      style={{
        position: "relative",
      }}
    >
      <input
        className="search-input"
        onChange={handleChange}
        placeholder="링크를 추가해 보세요"
      />
      <button className="search-input-button" onClick={onClick}>
        추가하기
      </button>
    </form>
  );
};

export default AddLink;
