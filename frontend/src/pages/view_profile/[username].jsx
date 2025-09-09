import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout/UserLayout";
import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getConnectionRequests,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/AuthAction";

function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionRequests({ token: localStorage.getItem("token") }));
    await dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  };

  useEffect(() => {
    let post = postReducer.posts.filter(
      (post) => post.userId.username === router.query.username
    );
    setUserPosts(post);
  }, [postReducer.posts, router.query.username]);

  useEffect(() => {
    if (
      authState.connections.some(
        (user) => user.connectionId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);

      if (
        authState.connections.find(
          (user) => user.connectionId._id === userProfile.userId._id
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      } else {
        setIsConnectionNull(true);
      }
    }

    if (
      authState.connectionRequest.some(
        (user) => user.userId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);

      if (
        authState.connectionRequest.find(
          (user) => user.userId._id === userProfile.userId._id
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      } else {
        setIsConnectionNull(true);
      }
    }
  }, [authState.connections, authState.connectionRequest, userProfile.userId._id]);

  useEffect(() => {
    getUserPost();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={style.container}>
          {/* Profile Picture */}
          <div className={style.backDropContainer}>
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              className={style.backDropImage}
            />
          </div>

          {/* Profile Info */}
          <div className={style.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "gray" }}>@{userProfile.userId.username}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    margin: "1rem 0",
                    alignItems: "center",
                  }}
                >
                  {isCurrentUserInConnection ? (
                    <button className={style.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            user_id: userProfile.userId._id,
                          })
                        );
                      }}
                      className={style.connectBtn}
                    >
                      Connect
                    </button>
                  )}

                  <div
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfile.userId._id}`
                      );
                      window.open(`${BASE_URL}/${response.data.message}`, "_blank");
                    }}
                    style={{
                      height: "1.4rem",
                      width: "1.4rem",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                      />
                    </svg>
                  </div>
                </div>

                <div className={style.bioSection}>{userProfile.bio}</div>
              </div>

              {/* Recent Activity */}
             
            </div>
          </div>

          {/* Work History */}
          <div className={style.workHistory}>
            <h4>Work History</h4>
            <div className={style.workHistory_container}>
              {userProfile.pastWork.map((work, index) => (
                <div key={index} className={style.workHistoryCard}>
                  <p
                    style={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    {work.company} - {work.position}
                  </p>
                  <p>{work.years}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className={style.workHistory}>
            <h4>Education</h4>
            <div className={style.workHistory_container}>
              {userProfile.education.map((edu, index) => (
                <div key={index} className={style.workHistoryCard}>
                  <p
                    style={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    {edu.school} - {edu.degree}
                  </p>
                  <p>{edu.fieldOfStudy}</p>
                  <p>{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>

                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={style.postCard}>
                      <div className={style.card}>
                        <div className={style.card_profileContainer}>
                          {post.media !== "" ? (
                            <img src={`${BASE_URL}/${post.media}`} />
                          ) : (
                            <div style={{ width: "5rem", height: "auto" }}></div>
                          )}
                        </div>

                        <p>{post.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default ViewProfilePage;

export async function getServerSideProps(context) {
  const request = await clientServer.get(`/user/get_profile_based_on_username`, {
    params: {
      username: context.query.username,
    },
  });

  return { props: { userProfile: request.data.profile } };
}
