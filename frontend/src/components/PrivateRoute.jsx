import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = () => {
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();

	if (!currentUser) {
		toast.error("Por favor inicia sesión para continuar.");
		navigate("/"); // Navigate to home
		return null; // Return null to prevent rendering the rest of the component
	}

	return <Outlet />;
};

export default PrivateRoute;
