import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import FooterComp from "./components/FooterComp";



function App() {

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <FooterComp />
      </BrowserRouter>
    </>
  )
}

export default App
