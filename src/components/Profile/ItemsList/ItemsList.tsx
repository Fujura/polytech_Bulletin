import { Link } from "react-router-dom";
import { Item } from "../../items/Item/Item";
import { FC } from "react";
import { AnimatePresence } from "framer-motion";

export const ItemList: FC<{
  options: {
    userData: any;
    token: string;
    setUpdatePage: any;
  };
}> = ({ options: { userData, token, setUpdatePage } }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "50px",
        margin: "20px auto 0",
        marginTop: "100px",
      }}
    >
      <AnimatePresence>
        {userData.items && userData.items.length > 0 ? (
          userData.items.map((item: any) => (
            <Item
              key={item.id}
              options={{
                itemId: item.id,
                type: item.type,
                username: userData.username,
                title: item.title,
                description: item.description,
                userAvatar: userData.avatarUrl,
                token: token,
                userId: userData.id,
                itemStatus: item.isConfirm,
                setUpdatePage: setUpdatePage,
              }}
              userData={userData}
            />
          ))
        ) : (
          <div>
            <p>У вас нету объявлений</p>
            <Link to={"/items/addItem"}>Разместить</Link>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
