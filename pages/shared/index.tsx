import React from "react";
import Nav from "@/pageComponents/sharedPageComponents/Nav";
import Header from "@/pageComponents/sharedPageComponents/Header";
import Article from "@/components/Article";
import Footer from "@/components/Footer";
import axios from "@/libs/axios";
import Head from "next/head";

export async function getStaticProps() {
  const res = await axios.get(`/sample/user`);
  const userEmail: string = res?.data?.email;
  const res2 = await axios.get(`/sample/folder`);
  const temp: Temp = res2.data;
  const profile: string = temp?.folder?.owner?.profileImageSource;
  const userName: string = temp?.folder?.owner?.name;
  const folderName: string = temp?.folder?.name;
  const fullData: Link[] = temp?.folder?.links;

  return {
    props: {
      userEmail,
      profile,
      userName,
      folderName,
      fullData,
    },
  };
}

export default function SharedPage({
  userEmail,
  profile,
  userName,
  folderName,
  fullData,
}: SharedPageProps) {
  return (
    <>
      <Head>
        <title>공유 페이지</title>
      </Head>
      <Nav userEmail={userEmail} />
      <Header
        profile={profile}
        userName={userName}
        folderName={folderName}
        fullData={fullData}
      />
      <Article />
      <Footer />
    </>
  );
}
