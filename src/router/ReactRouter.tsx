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

const ReactRouter = () => {
  const [cookie, , removeCookie ] = useCookies(['jwt'])

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signIn" element={<Login />} />
        <Route path="/signUp" element={<Register />} />
        <Route path="/profile" element={<Profile token={cookie.jwt} removeCookie={removeCookie}/>} />
        <Route path="/profile/:id" element={<UserProfile token={cookie.jwt}/>} />
        <Route path="/rules" element={<Rule />} />
        <Route path="/items" element={<Items token={cookie.jwt}/>} />
        <Route path="/items/addItem" element= {<AddItem />} />
        <Route path="/adminPanel" element={<AdminPanel token={cookie.jwt} />}/>
      </Routes>
    </Router>
  );
};

export default ReactRouter;
