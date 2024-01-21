import React from "react";
import styles from "/src/styles/Register.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import arrow from "/src/assets/arrow-back.svg";
import { link } from "../../../api/link";
export const Register = () => {
  const [formData, setFormData] = React.useState({
    username: "",
    fio: "",
    email: "",
    password: "",
    group: "",
    subrole: "Студент",
  });

  const [pwdLength, setPwdLength] = React.useState(0);
  const [confirmPwd, setConfirmPwd] = React.useState("");
  const navigate = useNavigate();
  const [isFormSubmited, setFormSubmited] = React.useState({
    submited: false,
    submitedText: "",
    submitedError: "",
    submitedColor: "",
  });



  const inputChangeHandler = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmPwd === formData.password) {
      try {
        await axios.post(`${link}/api/auth/local/register`, formData);
        console.log("succes");
        setFormSubmited({
          submited: true,
          submitedText: "Вы успешно зарегестрировались!",
          submitedError: "",
          submitedColor: "#238C47",
        });
        setTimeout(() => {
          navigate("/signIn");
        }, 1500);
      } catch (error) {
        console.error(error);
        setFormSubmited({
          submited: false,
          submitedText: "",
          submitedError: "Упс... Что-то пошло не так",
          submitedColor: "#9A001E	",
        });

        setTimeout(() => {
          setFormSubmited({
            submited: false,
            submitedText: "",
            submitedError: "",
            submitedColor: "",
          });
        }, 1500);
      }
    }
  };

  return (
    <div>
      <div>
        <Link to={"/"}>
          <img src={arrow} alt="" className={styles.arrow} />
        </Link>
      </div>

      {!!isFormSubmited.submited ? (
        <p style={{ color: `${isFormSubmited.submitedColor}` }}>
          {isFormSubmited.submitedText}
        </p>
      ) : (
        <div className={styles.container}>
          <form className={styles.form} onSubmit={submitHandler}>
            <label htmlFor="username" className={styles.inputLabel}>
              Имя пользователя
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={inputChangeHandler}
              className={styles.input}
            />

            <label htmlFor="email" className={styles.inputLabel}>
              Почта
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={inputChangeHandler}
              className={styles.input}
            />

            <label htmlFor="password" className={styles.inputLabel}>
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                inputChangeHandler(e);
                setPwdLength(e.target.value.length);
              }}
              className={styles.input}
            />
            {pwdLength >= 6 ? (
              <div>
                <label htmlFor="Conf_password" className={styles.inputLabel}>
                  Подтверждение пароля
                </label>
                <input
                  type="password"
                  name="Conf_password"
                  value={confirmPwd}
                  onChange={(e: any) => setConfirmPwd(e.target.value)}
                  className={styles.input}
                />
              </div>
            ) : (
              <></>
            )}
            <p style={{ color: `${isFormSubmited.submitedColor}` }}>
              {isFormSubmited.submitedError}
            </p>

            <button type="submit" className={styles.btn}>
              Зарегестрироваться
            </button>

            <Link to={'/signIn'} className={styles.signIn}>Уже есть учетная запись? Авторизуйтесь!</Link>

          </form>

          <p className={styles.rule}>
            Продолжая регистрацию, я соглашаюсь с{" "}
            <Link to={"/rules"}>
              {" "}
              Правилами пользования сайтом и обработки персональных данных
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};
