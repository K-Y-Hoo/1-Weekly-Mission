import "../../styles/landing.css";
import FolderName from "./FolderName";

const FolderList = ({ fullData }) => {
  return (
    <li
      style={{
        listStyle: "none",
        width: "100%",
      }}
    >
      {fullData.map((data) => (
        <FolderName key={data?.id} data={data} />
      ))}
    </li>
  );
};

export default FolderList;
