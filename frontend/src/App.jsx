import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import FooterComp from "./components/FooterComp";
import PrivateRoute from "./components/PrivateRoute";
import ScrollToTop from "./components/ScrollToTop";
import Studio from "./pages/Studio";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./components/ResetPassword";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Legal from "./pages/Legal";
import Practice from "./pages/Practice";

function App() {
	return (
		<>
			<ToastContainer />
			<BrowserRouter>
				<ScrollToTop />
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/studio/:slug" element={<Studio />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route path="/about" element={<About />} />
					<Route path="/privacy" element={<Privacy />} />
					<Route path="/legal" element={<Legal />} />
					<Route path="/practice" element={<Practice />} />

					<Route element={<PrivateRoute />}>
						<Route path="/dashboard" element={<Dashboard />} />
					</Route>
					<Route
						path="*"
						element={
							<h1 className="text-center text-3xl my-20 w-full">
								Página No Encontrada
							</h1>
						}
					/>
				</Routes>
				<FooterComp />
			</BrowserRouter>
		</>
	);
}

export default App;
