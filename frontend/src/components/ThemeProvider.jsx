import { useSelector } from "react-redux";
import bgLight from "../public/bg-light-2.jpg";
import bgDark from "../public/bg-dark.jpg";

const ThemeProvider = ({ children }) => {
	const { theme } = useSelector((state) => state.theme);
	return (
		<div className={theme}>
			<div
				className="min-h-screen bg-[url('../public/bg-light.jpg')] bg-fixed bg-center bg-no-repeat bg-cover text-gray-700
                dark:text-[#f7f8f8]"
				style={{
					backgroundImage:
						theme === "dark" ? `url(${bgDark})` : `url(${bgLight})`,
				}}>
				{children}
			</div>
		</div>
	);
};

export default ThemeProvider;
