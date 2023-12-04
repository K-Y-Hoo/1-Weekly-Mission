import React, { useEffect, useState } from "react";
import Search from "@/components/Search";
import FolderList from "./FolderList";
import { requestSingleFolderApi } from "@/libs/singleFolderApi";
import Cards from "./Cards";
import axios from "@/libs/axios";

interface GetData {
  getData: (data: Folders) => void;
}

const Header = ({ getData }: GetData) => {
  const [fullList, setFullList] = useState<Folders>();
  const [totalData, setTotalData] = useState<TotalData>();
  const [isTotalClicked, setIsTotalClicked] = useState(false);
  const [isSingleClicked, setIsSingleClicked] = useState(false);
  const [singleFolderDataId, setSingleFolderDataId] = useState<unknown>();
  const [singleFolderData, setSingleFolderData] = useState<SingleFolderData[]>(
    []
  );
  const [singleFolderName, setSingleFolderName] = useState("");
  const [isAddFolderClicked, setIsAddFolderClicked] = useState(false);
  const [isChangeFolderNameClicked, setIsChangeFolderNameClicked] =
    useState(false);
  const [isDeleteFolderClicked, setIsDeleteFolderClicked] = useState(false);
  const [isShareFolderClicked, setIsShareFolderClicked] = useState(false);

  function handleAddFolderClick(
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLImageElement>
  ) {
    e.preventDefault();
    setIsAddFolderClicked(!isAddFolderClicked);
  }

  function handleChangeFolderNameClick(
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLImageElement>
  ) {
    e.preventDefault();
    setIsChangeFolderNameClicked(!isChangeFolderNameClicked);
  }

  function handleDeleteFolderClick(
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLImageElement>
  ) {
    e.preventDefault();
    setIsDeleteFolderClicked(!isDeleteFolderClicked);
  }

  function handleShareFolderClick(
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLImageElement>
  ) {
    e.preventDefault();
    setIsShareFolderClicked(!isShareFolderClicked);
  }

  function handleCopyClipBoard(text: string) {
    try {
      navigator.clipboard.writeText(text);
      alert("링크가 클립보드에 복사되었습니다!");
    } catch (error) {
      alert("클립보드 복사에 실패하였습니다.");
    }
  }

  const getFolderLists = async () => {
    const temp = await axios.get(`/users/1/folders`);
    setFullList(temp?.data);
  };

  const getTotalData = async () => {
    const temp = await axios.get(`/users/1/links`);
    setTotalData(temp?.data);
  };

  useEffect(() => {
    getFolderLists();
  }, []);
  useEffect(() => {
    getTotalData();
  }, []);

  function handleTotalClick() {
    if (isSingleClicked) {
      setIsSingleClicked(false);
    }
    setIsTotalClicked(true);
  }

  const handleFolderClick = (folderId: unknown, folderName: string) => {
    if (isTotalClicked) {
      setIsTotalClicked(false);
    }
    setIsSingleClicked(true);
    setSingleFolderDataId(folderId as SingleFolderDataId | undefined);
    setSingleFolderName(folderName);
  };

  const [fullFolderData, setFullFolderData] = useState<Folders>({} as Folders);
  const getFullFolderData = async () => {
    const temp = await axios.get(`/users/1/folders`);
    setFullFolderData(temp?.data);
  };
  useEffect(() => {
    getFullFolderData();
  }, []);
  useEffect(() => {
    getData(fullFolderData as Folders);
  }, [fullFolderData]);
  const getSingleFolderData = async () => {
    const temp = await requestSingleFolderApi(singleFolderDataId as number);
    setSingleFolderData(temp?.data);
  };

  useEffect(() => {
    if (!singleFolderDataId) return;
    getSingleFolderData();
  }, [singleFolderDataId]);

  const currentLink = `localhost:3000/shared?user={1}&folder=${singleFolderDataId}`;

  function handleFaceBookClick(
    e: React.MouseEvent<HTMLButtonElement>,
    url: string
  ) {
    e.preventDefault();
    window.open(`http://www.facebook.com/sharer.php?u=${url}`);
  }

  function handleKakaoClick(
    e: React.MouseEvent<HTMLButtonElement>,
    url: string
  ) {
    e.preventDefault();
    alert("Kakao SDK가 로드되지 않았습니다. 나중에 다시 시도해주세요.");
    return;
    const sharedUrl = url;
    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: "카카오톡 공유",
          description: "카카오톡으로 주소를 공유합니다.",
          imageUrl: "이미지 URL",
          link: {
            mobileWebUrl: sharedUrl,
            webUrl: sharedUrl,
          },
        },
        buttons: [
          {
            title: "웹에서 보기",
            link: {
              mobileWebUrl: sharedUrl,
              webUrl: sharedUrl,
            },
          },
        ],
      });
    } else {
      alert("Kakao SDK가 로드되지 않았습니다. 나중에 다시 시도해주세요.");
    }
  }
  const [inputValue, setInputValue] = useState("");
  function getInputValue(v: string) {
    setInputValue(v);
  }
  let searchedData: SingleFolderData[] = [];

  if (isTotalClicked && totalData) {
    searchedData = totalData?.data?.filter((data) => {
      if (
        data?.url?.includes(inputValue) ||
        data?.title?.includes(inputValue) ||
        data?.description?.includes(inputValue)
      ) {
        return data;
      }
    });
  } else if (isSingleClicked) {
    searchedData = singleFolderData?.filter((data) => {
      if (
        data?.url?.includes(inputValue) ||
        data?.title?.includes(inputValue) ||
        data?.description?.includes(inputValue)
      ) {
        return data;
      }
    });
  } else if (!isTotalClicked && !isSingleClicked) {
    searchedData = [];
  }

  return (
    <>
      <Search getInputValue={getInputValue} />

      <div className="folder-list">
        <button
          className="folder-list-button"
          onClick={handleTotalClick}
          style={{ background: isTotalClicked ? "#6D6AFE" : "#fff" }}
        >
          전체
        </button>

        {fullList && (
          <FolderList
            fullData={fullList}
            handleFolderClick={handleFolderClick}
            isTotalClicked={isTotalClicked}
          />
        )}
      </div>
      <button className="folder-add-button" onClick={handleAddFolderClick}>
        폴더 추가
        <img src="/images/add.svg" />
      </button>
      {isAddFolderClicked ? (
        <div className="modal-background">
          <div className="modal">
            <p>
              <b>폴더 추가</b>
            </p>
            <div style={{ position: "relative" }}>
              <img
                src="images/modalClose.svg"
                style={{
                  position: "absolute",
                  right: "-16.5rem",
                  top: "-5rem",
                }}
                onClick={handleAddFolderClick}
              />
            </div>
            <input
              style={{
                width: "28rem",
                height: "4rem",
                borderRadius: "8px",
                border: "1px solid var(--linkbrary-gray-20, #CCD5E3)",
                padding: "0 2rem",
              }}
              placeholder="내용 입력"
            ></input>
            <button
              style={{
                background:
                  "var(--gra-purpleblue-to-skyblue, linear-gradient(91deg, #6D6AFE 0.12%, #6AE3FE 101.84%))",
                borderRadius: "8px",
                width: "28rem",
                height: "2rem",
                padding: "1.6rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              추가하기
            </button>
          </div>
        </div>
      ) : null}

      {isChangeFolderNameClicked ? (
        <div className="modal-background">
          <div className="modal">
            <p>
              <b>폴더 이름 변경</b>
            </p>
            <div style={{ position: "relative" }}>
              <img
                src="images/modalClose.svg"
                style={{
                  position: "absolute",
                  right: "-16.5rem",
                  top: "-5rem",
                }}
                onClick={handleChangeFolderNameClick}
              />
            </div>
            <input
              style={{
                width: "28rem",
                height: "4rem",
                borderRadius: "8px",
                border: "1px solid var(--linkbrary-gray-20, #CCD5E3)",
                padding: "0 2rem",
              }}
              placeholder="변경할 이름 입력"
            ></input>
            <button
              style={{
                background:
                  "var(--gra-purpleblue-to-skyblue, linear-gradient(91deg, #6D6AFE 0.12%, #6AE3FE 101.84%))",
                borderRadius: "8px",
                width: "28rem",
                height: "2rem",
                padding: "1.6rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              변경하기
            </button>
          </div>
        </div>
      ) : null}

      {isDeleteFolderClicked ? (
        <div className="modal-background">
          <div className="modal">
            <b>폴더 삭제</b>
            <div style={{ position: "relative" }}>
              <img
                src="images/modalClose.svg"
                style={{
                  position: "absolute",
                  right: "-16.5rem",
                  top: "-6rem",
                }}
                onClick={handleDeleteFolderClick}
              />
            </div>

            <div>{singleFolderName}</div>
            <button
              style={{
                background: "var(--linkbrary-red, #FF5B56)",
                borderRadius: "8px",
                width: "28rem",
                height: "2rem",
                padding: "1.6rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              삭제하기
            </button>
          </div>
        </div>
      ) : null}

      {isShareFolderClicked ? (
        <div className="modal-background">
          <div className="modal">
            <p style={{ width: "28rem", textAlign: "center" }}>
              <b>폴더 공유</b>
            </p>
            <p>{singleFolderName}</p>
            <div style={{ position: "relative" }}>
              <img
                src="images/modalClose.svg"
                style={{
                  position: "absolute",
                  right: "-16.5rem",
                  top: "-9rem",
                }}
                onClick={handleShareFolderClick}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "3.2rem",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={(e) => handleKakaoClick(e, currentLink)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <img
                  src="images/kakao.svg"
                  style={{ width: "4rem", height: "4rem" }}
                />
                카카오톡
              </button>
              <button
                onClick={(e) => handleFaceBookClick(e, currentLink)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <img
                  src="images/facebook2.svg"
                  style={{ width: "4rem", height: "4rem", background: "blue" }}
                />
                페이스북
              </button>
              <button
                onClick={() => handleCopyClipBoard(currentLink)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <img
                  src="images/shareLink.svg"
                  style={{ width: "4rem", height: "4rem" }}
                />
                링크 복사
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {totalData && isTotalClicked && (
        <div className="header-summary">전체</div>
      )}

      {singleFolderData && isSingleClicked && (
        <div className="header-summary">
          {singleFolderName}
          <div className="folder-data-util-buttons">
            <button onClick={handleShareFolderClick}>
              <img src="/images/share.svg" />
              공유
            </button>
            <button onClick={handleChangeFolderNameClick}>
              <img src="/images/pen.svg" />
              이름 변경
            </button>
            <button onClick={handleDeleteFolderClick}>
              <img src="/images/discard.svg" />
              삭제
            </button>
          </div>
        </div>
      )}
      {searchedData && inputValue !== "" && (
        <Cards fullData={searchedData} fullFolderData={fullFolderData?.data} />
      )}
      {totalData && isTotalClicked && inputValue === "" && (
        <Cards
          fullData={totalData?.data}
          fullFolderData={fullFolderData?.data}
        />
      )}
      {singleFolderData && isSingleClicked && inputValue === "" && (
        <Cards
          fullData={singleFolderData}
          fullFolderData={fullFolderData?.data}
        />
      )}
      {singleFolderData.length === 0 && isSingleClicked && (
        <div
          className="folder-list"
          style={{
            fontSize: "1.6rem",
            display: "flex",
            justifyContent: "center",
            paddingTop: "4rem",
            paddingBottom: "4rem",
          }}
        >
          저장된 링크가 없습니다
        </div>
      )}
    </>
  );
};

export default Header;
