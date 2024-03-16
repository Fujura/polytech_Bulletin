import React, { FC } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import arrow from "/src/assets/arrow-back.svg";
import { Link, useNavigate } from "react-router-dom";
import styles from "/src/styles/Login.module.css";
import { link } from "../../../api/link";

interface IData {
  identifier: string;
  password: string;
}

interface IStatus {
  text: string;
  color: string;
}

export const Login: FC = () => {
  const [userData, setUserData] = React.useState<IData>({
    identifier: "",
    password: "",
  });
  const [cookie, setCookie] = useCookies(["jwt"]);
  const [status, setStatus] = React.useState<IStatus>({
    text: '',
    color: ''
  });
  const navigate = useNavigate();
  let date = new Date();

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${link}/api/auth/local`, userData);
      date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
      setCookie("jwt", data.jwt, { expires: date });
      setStatus({
        text: "Вы успешно прошли авторизацию!",
        color: "#248F40"
      });
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      console.error(error);
      setStatus({
        text: "Неправильный логин или пароль!",
        color: '#B92E3B'
      });
    }
  };

  React.useEffect(() => {
    if (!!cookie.jwt) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <div>
        <div>
          <Link to={"/"}>
            <img src={arrow} alt="" className={styles.arrow} />
          </Link>
        </div>
        <div className={styles.container}>
          <form onSubmit={formSubmitHandler} className={styles.form}>
            <label className={styles.text}>Логин или почта</label>
            <input
              type="text"
              name="identifier"
              value={userData.identifier}
              onChange={inputChangeHandler}
              className={styles.input}
            />

            <label className={styles.text}>Пароль</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={inputChangeHandler}
              className={styles.input}

            />
            <p style={{color: status.color}}>{status.text}</p>
            <button type="submit" className={styles.btn}>Войти</button>
            <Link to={'/signUp'} className={styles.signUp}>Нету учетной записи? Зарегестрируйтесь!</Link>
          </form>
        </div>
      </div>
    </div>
  );
};
