import { getAboutUser } from "@/config/redux/action/AuthAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./style.module.css";
import { BASE_URL, clientServer } from "@/config";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";

function ProfileComponent() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const postReducer = useSelector((state) => state.postReducer);

  const router = useRouter();

  const [modalType, setModalType] = useState(null);

  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const [educationInputData, setEducationInputData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    year: "",
  });

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setEducationInputData({
      ...educationInputData,
      [name]: value,
    });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user !== undefined) {
      setUserProfile(authState.user);

      let post = postReducer.posts.filter(
        (post) => post.userId.username === authState.user.userId.username
      );

      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    await clientServer.post("/update_profile_picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={style.container}>

            {/* Profile Picture */}
            <div className={style.backDropContainer}>
              
              <div className={style.backDrop}>
                <label htmlFor="profilePictureUpload" className={style.backDrop_overlay}>
                  <p>Edit</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 
                         2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 
                         1.13l-2.685.8.8-2.685a4.5 4.5 0 0 
                         1 1.13-1.897L16.863 4.487Zm0 
                         0L19.5 7.125" />
                  </svg>
                </label>

                <input
                  onChange={(e) => updateProfilePicture(e.target.files[0])}
                  hidden
                  type="file"
                  id="profilePictureUpload"
                />
                <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} />
              </div>
            </div>

            {/* Profile Info */}
            <div className={style.profileContainer_details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div className={style.top}>
                    <input
                      className={style.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          userId: { ...userProfile.userId, name: e.target.value },
                        })
                      }
                    />
                    <p style={{ color: "gray" }}>@{userProfile.userId.username}</p>
                  </div>

                  <div>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%", resize: "none" }}
                    ></textarea>
                  </div>
                </div>

                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.map((post) => (
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
                  ))}
                </div>
              </div>
            </div>

            {/* Work History */}
            <div className={style.workHistory}>
              <h4>Work History</h4>
              <div className={style.workHistory_container}>
                {userProfile.pastWork.map((work, index) => (
                  <div key={index} className={style.workHistoryCard}>
                    <p style={{ fontWeight: "bold", display: "flex", gap: "0.8rem", alignItems: "center" }}>
                      {work.company} - {work.position}
                      <span
                        onClick={() => {
                          const updatedWork = userProfile.pastWork.filter((_, i) => i !== index);
                          setUserProfile({ ...userProfile, pastWork: updatedWork });
                        }}
                        style={{ marginLeft: "auto", cursor: "pointer", color: "red" }}
                      >
                        ❌
                      </span>
                    </p>
                    <p>{work.years}</p>
                  </div>
                ))}
                <button className={style.addWorkButton} onClick={() => setModalType("work")}>
                  Add Work
                </button>
              </div>
            </div>

            {/* Education */}
            <div className={style.workHistory}>
              <h4>Education</h4>
              <div className={style.workHistory_container}>
                {userProfile.education.map((edu, index) => (
                  <div key={index} className={style.workHistoryCard}>
                    <p style={{ fontWeight: "bold", display: "flex", gap: "0.8rem", alignItems: "center" }}>
                      {edu.school} - {edu.degree}
                      <span
                        onClick={() => {
                          const updatedEducation = userProfile.education.filter((_, i) => i !== index);
                          setUserProfile({ ...userProfile, education: updatedEducation });
                        }}
                        style={{ marginLeft: "auto", cursor: "pointer", color: "red" }}
                      >
                        ❌
                      </span>
                    </p>
                    <p>{edu.fieldOfStudy}</p>
                    <p>{edu.year}</p>
                  </div>
                ))}
                <button className={style.addWorkButton} onClick={() => setModalType("education")}>
                  Add Education
                </button>
              </div>
            </div>

            {userProfile !== authState.user && (
              <div onClick={() => updateProfileData()} className={style.updateProfileBtn}>
                Update Profile
              </div>
            )}
          </div>
        )}

        {/* Work Modal */}
        {modalType === "work" && (
          <div onClick={() => setModalType(null)} className={style.commentsContainer}>
            <div onClick={(e) => e.stopPropagation()} className={style.allCommentsContainer}>
              <input onChange={handleWorkInputChange} name="company" className={style.inputField} type="text" placeholder="Enter Company" />
              <input onChange={handleWorkInputChange} name="position" className={style.inputField} type="text" placeholder="Enter Position" />
              <input onChange={handleWorkInputChange} name="years" className={style.inputField} type="number" placeholder="Years" />
              <div
                onClick={() => {
                  setUserProfile({ ...userProfile, pastWork: [...userProfile.pastWork, inputData] });
                  setModalType(null);
                }}
                className={style.updateProfileBtn}
              >
                Add Work
              </div>
            </div>
          </div>
        )}

        {/* Education Modal */}
        {modalType === "education" && (
          <div onClick={() => setModalType(null)} className={style.commentsContainer}>
            <div onClick={(e) => e.stopPropagation()} className={style.allCommentsContainer}>
              <input onChange={handleEducationInputChange} name="school" className={style.inputField} type="text" placeholder="Enter University/School/College Name" />
              <input onChange={handleEducationInputChange} name="degree" className={style.inputField} type="text" placeholder="Enter Degree" />
              <input onChange={handleEducationInputChange} name="fieldOfStudy" className={style.inputField} type="text" placeholder="Enter Field Of Study" />
              <input onChange={handleEducationInputChange} name="year" className={style.inputField} type="text" placeholder="Enter Year" />
              <div
                onClick={() => {
                  setUserProfile({ ...userProfile, education: [...userProfile.education, educationInputData] });
                  setModalType(null);
                }}
                className={style.updateEducationBtn}
              >
                Add Education
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

export default ProfileComponent;  