import axios from "axios";
import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { link } from "../../api/link";
import defaultAvatar from "/public/profileDefault.png";
import styles from "/src/styles/UserProfile.module.css";
import { motion } from "framer-motion";
import { Item } from "../items/Item";

export const UserProfile: FC<{token: string}> = ({token}) => {
  const [userData, setUserData] = React.useState({
    username: "",
    id: 0,
    avatarUrl: "",
    items: [
        {
            id: 0,
            type: '',
            title: '',
            description: '',
            isConfirm: false
        }
    ],
  });
  
  const [userId, setUserId] = React.useState<number>()
  const [isUserUpdated, ] = React.useState(false);
  const [confirmItem, setConfirmItem] = React.useState<any[]>([]);
  const [isDataFetching, setDataFetching] = React.useState<boolean>(true);
  const navigate = useNavigate();
  let { id: ID } = useParams();

  React.useEffect(() => {
    if (!!token) {
        (async () => {
          try {
            const response = await axios.get(`${link}/api/users/me?populate=*`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          
            setUserId(response.data.id);
            setDataFetching(false)
          } catch (error) {
            console.error(error);
          }
        })();
      }
      
    if (!!ID) {
      (async () => {
        try {
          const response = await axios.get(
            `${link}/api/users/${ID}?populate=*`
          );
          setUserData(response.data);
          setConfirmItem(response.data.items.filter((item: any) => item.isConfirm === true));
          
        } catch (error) {
          console.error({ error });
        }
      })();
    }

    
  }, [isUserUpdated]);
  
  if(ID == userId){
    console.log('okey');
    
    navigate('/profile')
  }
  
  return (
    <div>
      {isDataFetching ?
      <p className={styles.loading}>Загрузка...</p> :
      <>
      <motion.div
        className="container"
        initial={{ scale: 0, opacity: 0, y: 500 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 40,
        }}
      >
        <img
          src={
            !userData.avatarUrl ? defaultAvatar : `${link}${userData.avatarUrl}`
          }
          alt="profile image"
          className={styles.user__HeaderAvatar}
        />
        <h2 className={styles.user__HeaderUsername}>{userData.username}</h2>
      </motion.div>

      <div >
        <h3 style={{color: '#fff', marginTop: '100px'}}>Объявления пользователя:</h3>
        <div className={styles.items__Container}>
          {Array.isArray(userData.items) && userData.items.length > 0 ? (
          confirmItem.map(item => (
            <Item
              key={item.id}
              itemId={item.id}
              type={item.type}
              username={userData.username}
              title={item.title}
              description= {item.description}
              userAvatar={userData.avatarUrl}
              token={token}
              userId={userData.id}
            />
          ))
        ) : (
          <p>У пользователя нет объявлений</p>
        )}
        </div>
        
      </div>
      </>
      
    }
      
    </div>
  );
};
