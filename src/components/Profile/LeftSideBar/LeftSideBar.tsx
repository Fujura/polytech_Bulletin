import { link } from "../../../api/link";
import styles from "/src/styles/Profile.module.css";
import profileIcon from "/public/profileDefault.png";
import logoutIcon from "/src/assets/logout.svg";
import { UploadAvatar } from "../UploadAvatar/UploadAvatar";
import { FC } from "react";
import { ILeftSideBar } from "../../../interfaces/Profile/ILeftSideBar";

const LeftSidebar: FC<ILeftSideBar> = ({
  options: {
    userData,
    showLeftBar,
    token,
    setUserUpdated,
    handleLogout,
  },
}) => {
  return (
    <div
      style={{
        transform: `translateX(${showLeftBar ? "0" : "-200px"})`,
        ...(window.innerWidth > 768 ? { transform: "translateX(0)" } : {}),
      }}
      className={styles.profile__LeftSide}
    >
      <div>
        <img
          src={
            userData.avatarUrl ? `${link}${userData.avatarUrl}` : profileIcon
          }
          alt="profile icon"
          className={styles.profilePicture}
        />
        <UploadAvatar
          token={token}
          username={userData.username}
          userId={userData.id}
          avatarUrl={userData.avatarUrl}
          setUserUpdated={setUserUpdated}
        />
        <p>{userData.username}</p>
      </div>

      <div>
        <div
          onClick={handleLogout} // Use the provided handleLogout function
          className={styles.logout__Container}
        >
          <p>Log Out</p>
          <img src={logoutIcon} className={styles.logout} />
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
