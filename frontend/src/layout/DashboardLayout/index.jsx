import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { setTokenIsThere } from "@/config/redux/reducer/AuthReducer";
import { useDispatch, useSelector } from "react-redux";

function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");

    dispatch(setTokenIsThere());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const sidebarItems = [
    {
      label: "Home",
      icon: (
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
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
      route: "/dashboard",
    },
    {
      label: "Discover",
      icon: (
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
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      ),
      route: "/discover",
    },
    {
      label: "My Connections",
      icon: (
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
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      ),
      route: "/my_connection",
    },
    {
      label: "Profile",
      icon: (
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
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
      ),
      route: "/profile",
    },
    {
      label: "Logout",
      icon: (
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
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 6h8"
          />
        </svg>
      ),
      action: handleLogout,
    },
  ];

  return (
    <div>
      {/* Hamburger button */}
      <div
        className={styles.mobileHamburger}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? (
          // Cross (X) icon when sidebar is open
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

        ) : (
          // Hamburger icon when sidebar is closed
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
        </svg>
        
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            zIndex: 40,
          }}
          onClick={() => setShowSidebar(false)}
        >
          <div
            className={styles.mobileSidebar}
            style={{ right: 0, left: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={styles.sideBarOption}
                onClick={() =>
                  item.route
                    ? router.push(item.route)
                    : item.action && item.action()
                }
              >
                {item.icon}
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.homeContainer}>
          {/* Desktop Left Sidebar */}
          <div className={styles.homeContainer_leftBar}>
            {sidebarItems.slice(0, 3).map((item) => (
              <div
                key={item.label}
                className={styles.sideBarOption}
                onClick={() => router.push(item.route)}
              >
                {item.icon}
                <p>{item.label}</p>
              </div>
            ))}
          </div>

          {/* Main Feed */}
          <div className={styles.feedContainer}>{children}</div>

          {/* Extra Container */}
          <div className={styles.extraContainer}>
            <h3 className={styles.heading}>Top Profile</h3>
            {authState?.all_profiles_fetched &&
              authState?.all_users?.map((profile) => (
                <div
                  key={profile._id}
                  className={styles.extraContainer_profile}
                >
                  <p>{profile?.userId?.name || "No name"}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
