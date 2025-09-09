import { getAllUsers } from "@/config/redux/action/AuthAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout/UserLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./style.module.css"
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";


function DiscoverPage() {
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);

  const router = useRouter();

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={style.main}>
          <h1>Discover</h1>

          <div className={style.allUserProfile}>

            {
              authState.all_profiles_fetched && authState.all_users.map((user) => {
                return(
                  <div 
                  onClick={() => {
                    router.push(`view_profile/${user.userId.username}`)
                  }}
                  key={user._id} className={style.userCard}>
                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profile" />
                    <div>
                    <h3>{user.userId.name}</h3>
                    <p>@{user.userId.username}</p>
                    </div>
                  </div>
                )
              })
            }

          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DiscoverPage;
