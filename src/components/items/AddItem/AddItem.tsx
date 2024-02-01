import axios from "axios";
import React, { FC, FormEvent } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { link } from "../../../api/link";
import styles from "/src/styles/AddItem.module.css";
import confetti from "canvas-confetti";

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
  const [isAuth, setIsAuth] = React.useState<boolean>(true);
  const [isSubmited, setIsSubmited] = React.useState<boolean | null>(null);
  const navigate = useNavigate();
  const [cookie] = useCookies(["jwt"]);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.type === "" || userData.items.length >= 5) {
      setIsSubmited(false);
      setTimeout(() => {
        setIsSubmited(null);
      }, 2500);
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
      setIsSubmited(true);
      confetti({
        particleCount: 150,
        spread: 60,
      }); 
      setTimeout(() => {
        setIsSubmited(null);
      }, 2500);
    } catch (error) {
      setIsSubmited(false);
      setTimeout(() => {
        setIsSubmited(null);
      }, 2500);
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (!!cookie.jwt === false) {
      setIsAuth(false);
      setTimeout(() => {
        navigate("/signIn");
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
  }, [cookie, submitHandler]);


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

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {isAuth ? (
        <form className={styles.form} onSubmit={submitHandler}>
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
          <p style={{ color: "#fff" }}>Максимальное кол-во объявлений - 5!</p>
          <button type="submit">
            Разместить
          </button>
          {isSubmited ? (
            <p style={{ color: "#00B64F" }}>
              Ваше объявление успешно отправлено на модерацию!
            </p>
          ) : isSubmited === null ? (
            <></>
          ) : (
            <p style={{ color: "#FF0000" }}>Упс.. Что то пошло не так</p>
          )}
        </form>
      ) : (
        <p className={styles.status}>Для начала пройдите авторизацию!</p>
      )}
    </div>
  );
};
