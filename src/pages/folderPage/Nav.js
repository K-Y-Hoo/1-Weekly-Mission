import React, { useEffect } from "react";
import "../../styles/landing.css";
import "./nav.css";
import { useAsync } from "../../hooks/useAsync";
import { getProfileData } from "../../api/folderOwnerApi";

const Nav = () => {
  const [userEmail, getProfileDataAsync] = useAsync(getProfileData);

  useEffect(() => {
    getProfileDataAsync();
  }, []);

  return (
    <>
      <nav className="folderPage-nav">
        <div className="gnb">
          <a href="/">
            <img
              className="logo"
              src="/images/logo.svg"
              alt="홈으로 연결된 Linkbrary 로고"
            />
          </a>
          {userEmail ? (
            <div className="cta cta-short-account">
              <div>
                <img
                  className="accountImg1"
                  src="images/Ellipse.svg"
                  alt="계정 배경 이미지"
                />
                <img
                  className="accountImg2"
                  src="images/myprofile.svg"
                  alt="계정 이미지"
                />
              </div>
              <div>
                <p style={{ fontSize: "1.4rem" }}>{userEmail}</p>
              </div>
            </div>
          ) : (
            <a className="cta cta-short" href="signin.html">
              <span>로그인</span>
            </a>
          )}
        </div>
      </nav>
    </>
  );
};

export default Nav;
