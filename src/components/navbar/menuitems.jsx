import Home from "../pages/home";
import About from "../pages/about";
import ContactUs from "../pages/contactus";
import Login from "../pages/login";

function MenuItems({ isAuth }) {
    let MenuItems = [];

    const addItem = (title, url, cName, content) => {
        MenuItems = [...MenuItems, { title, url, cName, content }];
    };

    addItem("Home", "/", "nav-links", <Home />);
    addItem("About", "/about", "nav-links", <About />);
    addItem("Contact Us", "/contactus", "nav-links", <ContactUs />);
    addItem("Login", "/login", "nav-links btn", <Login />);

    return MenuItems;
}

export default MenuItems;
