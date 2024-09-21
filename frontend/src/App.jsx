import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import FooterComp from "./components/FooterComp";
import CreateStudio from "./pages/CreateStudio";
import PrivateRoute from "./components/PrivateRoute";
import EditStudio from "./pages/EditStudio";
import ScrollToTop from "./components/ScrollToTop";
import Studio from "./pages/Studio";

function App() {
	return (
		<>
			<ToastContainer />
			<BrowserRouter>
				<ScrollToTop />
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/studio/:id" element={<Studio />} />
					<Route element={<PrivateRoute />}>
						<Route path="/createStudio" element={<CreateStudio />} />
						<Route path="/editStudio" element={<EditStudio />} />
					</Route>
				</Routes>
				<FooterComp />
			</BrowserRouter>
		</>
	);
}

export default App;
