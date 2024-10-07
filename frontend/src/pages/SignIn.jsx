import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdCancelPresentation } from "react-icons/md";
import OAuth from "../components/OAuth";
import {
	getAuth,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../firebase";

const SignIn = () => {
	const [formData, setFormData] = useState({});
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { theme } = useSelector((state) => state.theme);
	const auth = getAuth(app);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		// console.log(e.target.value);
		setLoading(false);
		setErrorMessage(null);
		// setFormData({ ...formData, [e.target.id]: e.target.value });
		setFormData((prevFormData) => ({
			...prevFormData,
			[e.target.id]: e.target.value,
		}));
	};

	// console.log(formData);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			return setErrorMessage("Todos los campos son obligatorios!");
		}
		try {
			setLoading(true);
			setErrorMessage(null);

			const firebaseUser = await signInWithEmailAndPassword(
				auth,
				formData.email,
				formData.password
			);

			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					firebaseId: firebaseUser.user.uid,
				}),
			});
			const data = await res.json();
			if (data.success === false) {
				setLoading(false);
				setErrorMessage(data.message);
				return;
			}
			if (res.ok && firebaseUser && firebaseUser.user) {
				setLoading(false);
				dispatch(signInSuccess(data));
				navigate("/");
			}
		} catch (error) {
			setErrorMessage(error.message);
			setLoading(false);
		}
	};

	const handleForgotPassword = async (e) => {
		e.preventDefault();
		setError(null);
		setMessage(null);

		if (!formData.email) {
			return setError("Correo electrónico requerido!");
		}

		try {
			await sendPasswordResetEmail(auth, formData.email);
			setMessage(
				"¡Se envió un correo electrónico para restablecer la contraseña! Revisa tu bandeja de entrada."
			);
		} catch (error) {
			console.error(
				"Error al enviar el correo electrónico para restablecer la contraseña:",
				error
			);
			setError(error.message);
		}
	};

	return (
		<div className="min-h-screen py-10">
			<div
				className="flex p-5 md:p-10 max-w-4xl mx-5 sm:mx-10 md:mx-20 lg:mx-auto flex-col md:flex-row md:items-center gap-10 lg:min-h-[540px]
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-2xl dark:shadow-whiteLg">
				<div className="flex-1 md:px-5 flex flex-col gap-10 md:border-r-4 border-b-4 pb-10 md:border-b-0 border-gray-400">
					<Link
						to="/"
						className="font-semibold dark:text-white text-md md:text-3xl flex items-center justify-center">
						{/* <img
							src="logo3.png"
							alt="logo"
							className="object-cover w-10 h-10"
						/>
						<img
							src="logo2.png"
							alt="logo"
							className="object-cover h-6 sm:h-8"
						/> */}
						<span className="ml-1 text-3xl sm:ml-2 md:text-5xl">STUDIO</span>
					</Link>
					<div className="w-full flex flex-col gap-1 text-center">
						<span className="text-center">
							Continue with your Google account?
						</span>
						<OAuth />
					</div>
				</div>
				<div className="flex-1 md:px-5">
					<form
						className={`flex flex-col gap-3 ${theme}`}
						onSubmit={handleSubmit}>
						<div className="flex flex-col gap-1">
							<Label value="Iniciar sesión con correo electrónico" />
							<TextInput
								type="text"
								placeholder="Correo electrónico"
								id="email"
								onChange={handleChange}
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label value="Tu contraseña" />
							<TextInput
								type="password"
								placeholder="Contraseña"
								id="password"
								onChange={handleChange}
								required
							/>
						</div>
						<Button
							gradientDuoTone="purpleToBlue"
							type="submit"
							className="uppercase focus:ring-1 mt-1"
							disabled={loading || errorMessage}>
							{loading ? (
								<>
									<Spinner size="sm" />
									<span className="pl-3">Cargando...</span>
								</>
							) : (
								"Iniciar sesión"
							)}
						</Button>
					</form>
					<div className="flex flex-col justify-between text-sm mt-4 gap-1">
						<div className="text-red-500">
							<span className="cursor-pointer" onClick={handleForgotPassword}>
								¿Olvidaste tu contraseña?
							</span>
						</div>
						<div className="flex gap-2 text-sm">
							<span>¿No tienes una cuenta?</span>
							<Link to="/sign-up" className="text-blue-500">
								Inscribirse
							</Link>
						</div>
					</div>
					{errorMessage && (
						<div className="flex items-center gap-1 mt-4">
							<Alert className="flex-auto" color="failure" withBorderAccent>
								<div className="flex justify-between">
									<span>{errorMessage}</span>
									<span className="w-5 h-5">
										<MdCancelPresentation
											className="cursor-pointer w-6 h-6"
											onClick={() => setErrorMessage(null)}
										/>
									</span>
								</div>
							</Alert>
						</div>
					)}
					{error && (
						<div className="flex items-center gap-1 mt-4">
							<Alert className="flex-auto" color="failure" withBorderAccent>
								<div className="flex justify-between">
									<span>{error}</span>
									<span className="w-5 h-5">
										<MdCancelPresentation
											className="cursor-pointer w-6 h-6"
											onClick={() => setError(null)}
										/>
									</span>
								</div>
							</Alert>
						</div>
					)}
					{message && (
						<div className="flex items-center gap-1 mt-4">
							<Alert className="flex-auto" color="success" withBorderAccent>
								<div className="flex justify-between">
									<span>{message}</span>
									<span className="w-5 h-5">
										<MdCancelPresentation
											className="cursor-pointer w-6 h-6"
											onClick={() => setMessage(null)}
										/>
									</span>
								</div>
							</Alert>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SignIn;
