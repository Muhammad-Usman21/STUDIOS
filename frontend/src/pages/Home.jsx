import { useState, useEffect } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import StudioCard from "../components/StudioCard";
import homeLight from "../public/home-light5.png";
import { countries } from "countries-list";

const Home = () => {
	const [formData, setFormData] = useState({
		searchTerm: "",
		sort: "desc",
		country: "",
	});
	const [showMore, setShowMore] = useState(true);
	const [searchResults, setSearchResults] = useState([]);
	const location = useLocation();
	const navigate = useNavigate(); // Replaces useHistory
	// const [country, setCountry] = useState("");

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const countryOptions = Object.values(countries).map(
		(country) => country.name
	);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const searchTerm = params.get("searchTerm") || "";
		const sort = params.get("sort") || "desc";
		const country = params.get("country") || "";

		setFormData({ searchTerm, sort, country });

		fetchSearchResults({ searchTerm, sort, country });
	}, [location]);

	const fetchSearchResults = async (searchData) => {
		let queryParams = new URLSearchParams(searchData).toString();
		queryParams += `&startIndex=0&limit=9`;
		const response = await fetch(`/api/studio/search?${queryParams}`);
		const data = await response.json();
		if (data.length < 9) {
			setShowMore(false);
		}
		setSearchResults(data);
	};

	// Handle search button click
	const handleSearch = () => {
		const query = new URLSearchParams(formData).toString();
		navigate(`?${query}`, { replace: true }); // Replaces history.push()
		fetchSearchResults(formData);
	};

	const handleShowMore = async () => {
		try {
			const queryParams = new URLSearchParams(formData).toString();
			const startIndex = searchResults.length;
			const limit = 9;
			const response = await fetch(
				`/api/studio/search?${queryParams}&startIndex=${startIndex}&limit=${limit}`
			);
			const data = await response.json();
			if ((data, length < 9)) {
				setShowMore(false);
			}
			setSearchResults((prevResults) => [...prevResults, ...data]);
		} catch (error) {
			console.error("Error fetching more search results:", error);
		}
	};

	return (
		<div className="min-h-screen w-full">
			<div className="w-full relative bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-60">
				<div className="absolute left-[5%] top-[20%] flex flex-col gap-2 z-20">
					<h1 className=" text-blue-600 font-extrabold md:text-6xl">
						<span className="text-blue-400 md:text-5xl">APPOINTMENT</span>
						<br />
						BOOKING
						<br /> NOW
					</h1>
					<p className="w-96 text-xs md:text-lg hidden sm:inline">
						Discover and book the perfect studio for your next project with
						ease. Explore top-rated spaces tailored to your creative needs, all
						in one place
					</p>
					<a
						className="self-center mt-5 hidden sm:inline"
						href="#search"
						onClick={(e) => {
							e.preventDefault();
							document
								.getElementById("search")
								.scrollIntoView({ behavior: "smooth" });
						}}>
						<button className=" flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br  from-green-200  via-blue-300  to-blue-200  group-hover:from-red-200 group-hover:via-red-300  dark:text-white dark:hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
							<span className=" px-5 py-2.5 transition-all ease-in duration-75 bg-blue-300 dark:bg-blue-500 rounded-md group-hover:bg-opacity-0 text-xl">
								View Studios!
							</span>
						</button>
					</a>
				</div>
				<img className="w-full relative z-0" src={homeLight} alt="home-light" />
			</div>
			<div
				id="search"
				className="max-w-7xl mx-3 sm:mx-5 lg:mx-auto items-center justify-center flex flex-col gap-12 lg:gap-24 py-10 lg:py-24">
				{/* <div className="flex flex-col items-center justify-center gap-4 md:gap-8 p-5 md:p-10 bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-2xl dark:shadow-whiteLg">
					<span className="text-2xl md:text-4xl text-center">
						Capture Your Creative Moments
					</span>
					<span className="text-lg md:text-2xl text-center">
						Book Your Studio in Seconds!
					</span>
					<span className="text-md md:text-2xl text-center px-5 mt-5">
						Search for affordable studios and start recording your best work
						today.
					</span>
					<div className="flex flex-col gap-2 md:gap-4 w-full">
						<div className="flex flex-col md:flex-row gap-2 md:gap-4">
							<TextInput
								className="flex-grow"
								type="text"
								name="searchTerm"
								placeholder="Search"
								value={formData.searchTerm}
								onChange={handleChange}
							/>

							<Select
								className="w-full md:w-48"
								value={formData.country}
								onChange={(e) =>
									setFormData({ ...formData, country: e.target.value })
								}>
								<option value="" disabled>
									Seleccione un país
								</option>
								<option value="all">Todos los países</option>
								{countryOptions.map((country, index) => (
									<option key={index} value={country}>
										{country}
									</option>
								))}
							</Select>
							<Select
								className="w-full md:w-36"
								value={formData.sort}
								onChange={(e) =>
									setFormData({ ...formData, sort: e.target.value })
								}>
								<option value="desc">El último</option>
								<option value="asc">más antiguo</option>
							</Select>
							<Button
								className="w-full md:w-36 focus:ring-1"
								gradientDuoTone={"purpleToPink"}
								onClick={handleSearch}>
								Search
							</Button>
						</div>
					</div>
				</div> */}

				<div
					className="flex flex-col w-full items-center justify-center gap-6 lg:gap-10 p-3 lg:p-10 mb-10 
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-2xl dark:shadow-whiteLg">
					<span className="text-lg md:text-2xl text-center font-semibold">
						Book Your Studio in Seconds!
					</span>
					<div className="flex flex-col gap-2 md:gap-4 w-full max-w-4xl">
						<div className="flex flex-col md:flex-row gap-2 md:gap-4">
							<TextInput
								className="flex-grow"
								type="text"
								name="searchTerm"
								placeholder="Search"
								value={formData.searchTerm}
								onChange={handleChange}
							/>
							{/* <TextInput
								type="date"
								value={formData.selectedDate}
								onChange={(event) => {
									const selectedDate = event.target.value;

									// Create a Date object from the selected date
									const dateObj = new Date(selectedDate);

									// Get the day of the week (0 = Sunday, 1 = Monday, etc.)
									const dayOfWeek = dateObj.getDay();

									// Set both the selectedDate and the dayOfWeek in formData
									setFormData({
										...formData,
										// selectedDate: selectedDate,
										// dayOfWeek: dayOfWeek,
										selectedDate: dayOfWeek,
									});
								}}
							/> */}
							{/* <Select
								className="w-full md:w-40"
								value={formData.selectedDate}
								onChange={(e) =>
									setFormData({ ...formData, selectedDate: e.target.value })
								}>
								<option value="">Complete Week</option>
								<option value="monday">Monday</option>
								<option value="tuesday">Tuesday</option>
								<option value="wednesday">Wednesday</option>
								<option value="thursday">Thursday</option>
								<option value="friday">Friday</option>
								<option value="saturday">Saturday</option>
								<option value="sunday">Sunday</option>
							</Select> */}
							<Select
								className="w-full md:w-48"
								value={formData.country}
								onChange={(e) =>
									setFormData({ ...formData, country: e.target.value })
								}>
								<option value="" disabled>
									Seleccione un país
								</option>
								<option value="all">Todos los países</option>
								{countryOptions.map((country, index) => (
									<option key={index} value={country}>
										{country}
									</option>
								))}
							</Select>
							<Select
								className="w-full md:w-36"
								value={formData.sort}
								onChange={(e) =>
									setFormData({ ...formData, sort: e.target.value })
								}>
								<option value="desc">El último</option>
								<option value="asc">más antiguo</option>
							</Select>
							<Button
								className="w-full md:w-36 focus:ring-1"
								gradientDuoTone={"purpleToPink"}
								onClick={handleSearch}>
								Search
							</Button>
						</div>
					</div>
					<h1 className="font-semibold text-center text-lg md:text-3xl ">
						Resultados de la búsqueda
					</h1>
					{searchResults.length > 0 && (
						<>
							<div className="flex flex-wrap gap-5 items-center justify-center w-full">
								{searchResults.map((studio) => (
									<StudioCard key={studio._id} studio={studio} />
								))}
							</div>
							{showMore && (
								<button
									onClick={handleShowMore}
									className="text-center self-center">
									Show More
								</button>
							)}
						</>
					)}
					{searchResults.length === 0 && (
						<p>No hay oradores para esta búsqueda.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
