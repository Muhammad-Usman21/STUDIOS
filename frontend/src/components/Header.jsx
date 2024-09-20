import {
	Avatar,
	Button,
	Dropdown,
	DropdownDivider,
	Navbar,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { HiMoon, HiSun } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
	const path = useLocation().pathname;
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const { theme } = useSelector((state) => state.theme);

	const handleSignOut = async () => {
		// try {
		// 	await signOut(auth);

		// 	const res = await fetch("/api/auth/signout", {
		// 		method: "POST",
		// 	});
		// 	const data = await res.json();

		// 	if (!res.ok) {
		// 		return console.log(data.message);
		// 	}
		// 	if (res.ok) {
		// 		dispatch(signOutSuccess(data));
		// 	}
		// } catch (error) {
		// 	console.log(error.message);
		// }
	};

	return (
		<Navbar className="border-b-2 border-teal-600 lg:px-14 bg-cover bg-center sticky top-0 z-30">
			<Link
				to="/"
				className="font-semibold dark:text-white text-md sm:text-xl flex items-center justify-center">
				<img
					src="logo3.png"
					alt="logo"
					className="object-cover w-10 h-10"
				/>
				<img
					src="logo2.png"
					alt="logo"
					className="object-cover h-6 sm:h-8"
				/>
			</Link>
			<div className=" flex gap-2 md:order-2 items-center">
				<Button
					className="w-8 h-8 sm:w-10 sm:h-10 focus:ring-1 items-center bg-transparent border-teal-400"
					color="gray"
					pill
					onClick={() => dispatch(toggleTheme())}>
					{theme === "light" ? <HiMoon /> : <HiSun />}
				</Button>
				{currentUser ? (
					<Dropdown
						className={`z-40 ${theme}`}
						arrowIcon={false}
						inline
						label={
							<Avatar img={currentUser.profilePicture} alt="user" rounded />
						}>
						<Dropdown.Header>
							<span className="block text-sm">{currentUser.name}</span>
							<span className="block text-sm font-medium">
								{currentUser.email}
							</span>
						</Dropdown.Header>
						<DropdownDivider />
						<Dropdown.Item onClick={handleSignOut}>desconectar</Dropdown.Item>
					</Dropdown>
				) : (
					<Button
						gradientDuoTone="purpleToBlue"
						outline
						size="sm"
						className="focus:ring-1">
						Iniciar sesión
					</Button>
				)}
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse className={`${theme}`}>
				<Navbar.Link className="h-0 p-0 m-0"></Navbar.Link>
				<Link to="/">
					<Navbar.Link active={path === "/"} as={"div"}>
						Hogar
					</Navbar.Link>
				</Link>
				<Link to="/reservations">
					<Navbar.Link active={path === "/reservations"} as={"div"}>
						Reservations
					</Navbar.Link>
				</Link>
				<Link
					to={
						currentUser?.isSpeaker
							? "/dashboard?tab=edit-speaker"
							: "/dashboard?tab=speaker"
					}>
					<Navbar.Link
						active={
							path === "/dashboard?tab=speaker" ||
							path === "/dashboard?tab=edit-speaker"
						}
						as={"div"}>
						¿Eres orador?
					</Navbar.Link>
				</Link>
				<Link to="/annoucements">
					<Navbar.Link active={path === "/annoucements"} as={"div"}>
						Anuncios
					</Navbar.Link>
				</Link>
				{/* <Link to="/instructions">
					<Navbar.Link active={path === "/instructions"} as={"div"}>
						Instructions
					</Navbar.Link>
				</Link> */}
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
