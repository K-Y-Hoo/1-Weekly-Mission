import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { getFolder } from "./api";
import Search from "./Search";
import "./landing.css";

const Header = () => {
  const [profile, setProfile] = useState("");
  const [userName, setUserName] = useState("");
  const [folderName, setFolderName] = useState("");

  const defaultFolder = async () => {
    const temp = await getFolder();
    setProfile(temp.folder.owner.profileImageSource);
    setUserName(temp.folder.owner.name);
    setFolderName(temp.folder.name);
  };

  useEffect(() => {
    defaultFolder();
  }, []);

  //console.log(profile, userName, folderName);

  return (
    <>
      <header>
        <div className="hero-header" style={{ paddingBottom: "6rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <img src={profile} alt="폴더프로파일" style={{ width: "5.5rem" }} />
            <p style={{ fontSize: "1.6rem" }}>{userName}</p>
            <p style={{ fontSize: "4rem", fontWeight: "600" }}>{folderName}</p>
          </div>
        </div>
      </header>
      <Search />
      <Cards />
    </>
  );
};

export default Header;
