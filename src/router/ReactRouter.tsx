import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import { Login } from "../components/Authorization/Login/Login";
import { Register } from "../components/Authorization/Register/Register";
import { Profile } from "../components/Profile/Profile";
import { Items } from "../components/items/Items";
import { useCookies } from "react-cookie";
import { AddItem } from "../components/items/AddItem/AddItem";
import Rule from "../components/WebSiteRule/Rule";
import { UserProfile } from "../components/UserProfile/UserProfile";
import { AdminPanel } from "../components/AdminPanel/AdminPanel";
import React from "react";
import { link } from "../api/link";
import { NavBarProvider } from "../components/NavBar/NavBarContext";
import { LoadingItem } from "../components/Loading/LoadingItem";
import { fetchDataService } from "../services/strapi.service";

const ReactRouter = () => {
  const [cookie, , removeCookie] = useCookies(["jwt"]);
  const [userData, setUserData] = React.useState({
    username: "",
    id: 0,
    avatarUrl: "",
    role: {
      name: "",
    },
    items: [],
  });
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const [updatePage, setUpdatePage] = React.useState<boolean>(false);
  const params = {
    method: 'get',
    url: `${link}/api/users/me?populate=*`,
    headers: { Authorization: `Bearer ${cookie.jwt}`},
    states: {setData: setUserData, setLoading}
  };
  React.useEffect(() => {
    fetchDataService(params);
  }, [cookie.jwt, updatePage]);

  return (
    <Router>
      {isLoading ? (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingItem />
        </div>
      ) : (
        <NavBarProvider value={{ userData }}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/signIn" element={<Login />} />
            <Route path="/signUp" element={<Register />} />
            <Route
              path="/profile"
              element={
                <Profile
                  token={cookie.jwt}
                  removeCookie={removeCookie}
                  userData={userData}
                  setUpdatePage={setUpdatePage}
                />
              }
            />
            <Route
              path="/profile/:id"
              element={<UserProfile token={cookie.jwt} userData={userData} />}
            />
            <Route path="/rules" element={<Rule />} />
            <Route
              path="/items/page/:id"
              element={
                <Items
                  token={cookie.jwt}
                  userData={userData}
                  setUpdatePage={setUpdatePage}
                  updatePage={updatePage}
                />
              }
            />

            <Route
              path="/items/page/:id/filtred-type/:typeId"
              element={
                <Items
                  token={cookie.jwt}
                  userData={userData}
                  setUpdatePage={setUpdatePage}
                  updatePage={updatePage}
                />
              }
            />
            <Route
              path="/items/addItem"
              element={
                <AddItem setUpdatePage={setUpdatePage} userData={userData} />
              }
            />
            <Route
              path="/adminPanel"
              element={
                <AdminPanel
                  token={cookie.jwt}
                  userData={userData}
                  setUpdatePage={setUpdatePage}
                  updatePage={updatePage}
                />
              }
            />
          </Routes>
        </NavBarProvider>
      )}
    </Router>
  );
};

export default ReactRouter;
