import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/AuthReducer";

function Navbar() {
  const router = useRouter();

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          className={styles.logo1}
          onClick={() => {
            router.push("/");
          }}
        >
          <span className={styles.logo}>L</span>ink
          <span className={styles.logo}>O</span>ra
        </h1>

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && (
            <div>

              <div style={{display: "flex", gap:"1.2rem"}}>

                <p>Hey, {authState.user.userId.name}</p>

                <p onClick={() => {
                  router.push("/profile")
                }} style={{fontWeight: "bold", cursor: "pointer"}}>Profile</p>

                <p onClick={() => {
                  localStorage.removeItem("token")
                  router.push("/login")
                  dispatch(reset())
                }} style={{fontWeight: "bold", cursor: "pointer"}}>Logout</p>

              </div>


            </div>
          )}

          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a Part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
