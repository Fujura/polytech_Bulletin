import axios from "axios";
import React, { FC } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { link } from "../../api/link";
import styles from "/src/styles/AddItem.module.css";

export const AddItem: FC = () => {
  const [userData, setUserData] = React.useState<{ items: [] }>({
    items: [],
  });

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    type: "",
    user: "",
  });
  const navigate = useNavigate();
  const [cookie] = useCookies(["jwt"]);

  React.useEffect(() => {
    if (!!cookie.jwt === false) {
      setIsAuth("Вы не залогинены!");
      setTimeout(() => {
        navigate("/items");
      }, 2000);
    }
    (async () => {
      try {
        const response = await axios.get(`${link}/api/users/me?populate=*`, {
          headers: {
            Authorization: `Bearer ${cookie.jwt}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [cookie]);

  const [isAuth, setIsAuth] = React.useState("");
  const onChangeInputValue = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(() => ({
      ...formData,
      user: "",
      [name]: value,
    }));
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (formData.type === "" || userData.items.length >= 5) {
      console.log("error");
      alert("ошибка");
      return;
    }
    try {
      await axios.post(
        `${link}/api/items`,
        {
          data: {
            ...formData,
            user: userData,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.jwt}`,
          },
        }
      );
      setFormData({
        title: "",
        description: "",
        type: "",
        user: "",
      });
    } catch (error) {
      console.error(error);
    }
  };
  console.log(userData);

  return (
    <div style={{display:'flex', justifyContent: 'center'}}>
      {!cookie.jwt ? (
        <p>{isAuth}</p>
      ) : (
        <form
          className={styles.form}
          onSubmit={submitHandler}
        >
          <label htmlFor="title">Заголовок</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChangeInputValue}
            className={styles.input}
          />

          <label htmlFor="subtitle">Описание</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={onChangeInputValue}
            className={styles.input}
          />

          <label htmlFor="type">тип объявления</label>
          <select
            name="type"
            onChange={onChangeInputValue}
            value={formData.type}
            className={styles.input}
          >
            <option value=""></option>
            <option value="Работа">Работа</option>
            <option value="Резюме">Резюме</option>
            <option value="Продажа">Продажа</option>
            <option value="Покупка">Покупка</option>
          </select>

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};
