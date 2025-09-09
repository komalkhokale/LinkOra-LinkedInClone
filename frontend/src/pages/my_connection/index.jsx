import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout/UserLayout";
import React, { useEffect } from "react";
import style from "./style.module.css";
import { connect, useDispatch, useSelector } from "react-redux";
import { AcceptConnection, getMyConnectionRequests } from "@/config/redux/action/AuthAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

function MyConnectionPage() {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (authState.connectionRequest.length != 0) {
      console.log("connectionRequest", authState.connectionRequest);
    }
  }, [authState.connectionRequest]);

  const router = useRouter();

  return (
    <UserLayout>
      <DashboardLayout>
        <div style={{display: "flex",flexDirection: "column" }}>
          <h2>My Connection</h2>

          {authState.connectionRequest.length === 0 && <h3>No Connection Request</h3>}

          {authState.connectionRequest.length !== 0 &&
            authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user, index) => {
              return (
                <div  
                onClick={() => {
                  router.push(`/view_profile/${user.userId.username}`)
                }}
                className={style.userCard} key={index}>

                  <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                      }}>
                        
                    <div
                      className={style.profilePicture}
                      
                    >
                      <img
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt=""
                      />
                    </div>

                    <div className={style.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>@{user.userId.username}</p>
                    </div>
                       
                      <button onClick={(e) => {
                         e.stopPropagation(); 

                         dispatch(AcceptConnection({
                          connectionId: user._id,
                          token: localStorage.getItem("token"),
                          action: "accept"
                         }))
                      }} className={style.connectedButton}>Accept</button>
                  </div>
                </div>
              );
            })}



            <div className={style.network}>
            <h3>My Network</h3>
            {/* {authState.connectionRequest.map((user) => <p>user.id</p>)} */}
            {authState.connectionRequest.filter((connection) => connection.status_accepted !== null).map((user,index) => {
              return(
                <div  
              onClick={() => {
                router.push(`/view_profile/${user.userId.username}`)
              }}
              className={style.userCard} key={index}>

                <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                    }}>
                      
                  <div
                    className={style.profilePicture}
                    
                  >
                    <img
                      src={`${BASE_URL}/${user.userId.profilePicture}`}
                      alt=""
                    />
                  </div>

                  <div className={style.userInfo}>
                    <h3>{user.userId.name}</h3>
                    <p>@{user.userId.username}</p>
                  </div>
                     
                   
                </div>
              </div>
              )
            })}
            </div>



        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default MyConnectionPage;
