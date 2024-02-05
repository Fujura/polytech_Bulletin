import axios from "axios";
import React, { FC, FormEvent } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { link } from "../../../api/link";
import styles from "/src/styles/AddItem.module.css";
import confetti from "canvas-confetti";
import { IAddItem } from "../../../interfaces/IAddItem";

export const AddItem: FC<IAddItem> = ({ setUpdatePage, userData }) => {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    user: "",
  });

  const [isAuth, setIsAuth] = React.useState<boolean>(true);
  const [isSubmited, setIsSubmited] = React.useState<boolean | null>(null);
  const navigate = useNavigate();
  const [cookie] = useCookies(["jwt"]);
  const [selectDataValue, setSelectDataValue] = React.useState<any>();
  const [selectedValue, setSelectedValue] = React.useState<number | string>('')


  React.useEffect(()=>{
    const changeSelectValue = async() =>{
      try {
        await axios.get(`${link}/api/item-types/${selectedValue}`).then(({data}) => {
          setSelectDataValue(data.data) 
          console.log(data.data);
          
        })
      } catch (error) {
        console.log(error);
        
      }
    }
    changeSelectValue()
  },[selectedValue]);


  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((userData && userData.items && userData.items.length >= 5 || selectedValue == '')) {
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
            item_type: selectDataValue
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
        user: "",
      });
      setSelectedValue('')
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
    setUpdatePage(true);
  };

  React.useEffect(() => {
    if (!!cookie.jwt === false) {
      setIsAuth(false);
      setTimeout(() => {
        navigate("/signIn");
      }, 2000);
    }

    
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
    <div className={styles.form__Container}>
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
            onChange={(e: any) => setSelectedValue(e.target.value)}
            value={selectedValue}
            className={styles.input}
          >
            <option value=""></option>
            <option value="1">Резюме</option>
            <option value="2">Вакансия</option>
            <option value="3">Продажа</option>
            <option value="4">Покупка</option>
          </select>

          <p style={{ color: "#fff" }}>Максимальное кол-во объявлений - 5!</p>
          <button type="submit" disabled={(userData && userData.items && userData.items.length >= 5)}>
            Разместить
          </button>{" "}
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
