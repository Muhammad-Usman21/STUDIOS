import { useState, useEffect, useRef } from "react";
import { Button, Select, TextInput, Checkbox } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import StudioCard from "../components/StudioCard";
import homeLight from "../public/home-light5.png";
import { countries } from "countries-list";

const benefitsOptions = ["wifi", "parking", "air", "remote"];
const Home = () => {
	const [formData, setFormData] = useState({
		searchTerm: "",
		sort: "desc",
		// country: "",
		// minPrice: "",
		// maxPrice: "",
		// benefits: [],
	});
	const [showMore, setShowMore] = useState(true);
	const [searchResults, setSearchResults] = useState([]);
	const location = useLocation();
	const navigate = useNavigate(); // Replaces useHistory
	// const [country, setCountry] = useState("");

	const [storage, setStorage] = useState({ youtubeLinks: [] });

	useEffect(() => {
		const fetchStorage = async () => {
			try {
				const response = await fetch("/api/storage/get-storage");
				const data = await response.json();
				setStorage(data);
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchStorage();
	}, []);

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
		// const country = params.get("country") || "";
		// const minPrice = params.get("minPrice") || "";
		// const maxPrice = params.get("maxPrice") || "";
		// const benefitList = params.getAll("benefits") || [];
		// let benefits = [];

		// if (benefitList.length > 0) {
		// 	benefits = benefitList[0]
		// 		.split(",")
		// 		.map((benefit) => benefit.trim())
		// 		.filter((benefit) => benefit !== "");
		// }

		// setFormData({ searchTerm, sort, country, minPrice, maxPrice, benefits });
		setFormData({ searchTerm, sort });

		fetchSearchResults({
			searchTerm,
			sort,
			// country,
			// minPrice,
			// maxPrice,
			// benefits,
		});
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
	const handleSearch = async (formData) => {
		setShowMore(true);
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
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Handle checkbox changes for benefits
	const handleCheckboxChange = (e) => {
		const { value, checked } = e.target;
		setFormData((prevFormData) => {
			if (checked) {
				// Add the benefit if checked
				return { ...prevFormData, benefits: [...prevFormData.benefits, value] };
			} else {
				// Remove the benefit if unchecked
				return {
					...prevFormData,
					benefits: prevFormData.benefits.filter(
						(benefit) => benefit !== value
					),
				};
			}
		});
	};

	// Close dropdown if clicked outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="min-h-screen w-full">
			<div
				style={{
					backgroundImage: `url(${storage.backgroundImage})`,
				}}
				className={`w-full relative bg-opacity-80 dark:bg-opacity-60 bg-center bg-no-repeat bg-cover bg-fixed min-h-screen`}>
				<div className="flex flex-col gap-2 z-20 self-center justify-center items-center py-36">
					<h1 className=" text-blue-600 font-extrabold text-3xl md:text-6xl">
						Estudio Alquila
					</h1>
					<p className="w-64 md:w-96 text-sm md:text-lg inline text-center text-white">
						Descubra y reserve fácilmente el estudio perfecto para su próximo
						proyecto.
					</p>
					<a
						className="self-center mt-5 inline"
						href="#search"
						onClick={(e) => {
							e.preventDefault();
							document
								.getElementById("search")
								.scrollIntoView({ behavior: "smooth" });
						}}>
						<button className=" flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br  from-green-200  via-blue-300  to-blue-200  group-hover:from-red-200 group-hover:via-red-300  dark:text-white dark:hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
							<span className=" px-5 py-2.5 transition-all ease-in duration-75 bg-blue-300 dark:bg-blue-500 rounded-md group-hover:bg-opacity-0 text-xl">
								¡Ver estudios!
							</span>
						</button>
					</a>
				</div>
			</div>
			<div
				id="search"
				className="items-center justify-center flex flex-col gap-12 lg:gap-24 pt-20 bg-transparent backdrop-blur-[30px]">
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
					className="flex flex-col w-full items-center justify-center gap-6 lg:gap-10 px-3 lg:px-10 py-5 lg:py-10
				bg-transparent backdrop-blur-[30px]">
					<span className="text-lg md:text-2xl text-center font-semibold">
						¡Reserve su estudio en segundos!
					</span>
					<div className="flex flex-col gap-2 md:gap-4 w-full">
						<div className="flex flex-col gap-2 md:gap-4 max-w-3xl self-center w-full">
							{/* <div className="flex flex-col md:flex-row gap-2 md:gap-4">
								<TextInput
									className="flex-grow"
									type="text"
									name="searchTerm"
									placeholder="Search"
									value={formData.searchTerm}
									onChange={handleChange}
								/>
								<TextInput
									type="number"
									name="minPrice"
									placeholder="Min Price"
									min={0}
									value={formData.minPrice}
									onChange={handleChange}
								/>
								<TextInput
									type="number"
									name="maxPrice"
									placeholder="Max Price"
									value={formData.maxPrice}
									min={formData.minPrice}
									onChange={handleChange}
								/>
							</div>
							<div className="flex flex-col md:flex-row gap-2 md:gap-4">
								<div className="dropdown" ref={dropdownRef}>
									<button
										type="button"
										onClick={() => setDropdownOpen(!dropdownOpen)}
										className="w-full md:w-56 h-10 border rounded-lg border-white bg-[#d8e2f3] dark:bg-[#010e16] dark:border-gray-600 flex items-center justify-between px-2">
										Select Facilities...
										<span className="ml-2">&#9660;</span>
									</button>
									{dropdownOpen && (
										<div className="dropdown-menu absolute mt-1 w-full md:w-56 bg-white dark:bg-[#010e16] border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
											{benefitsOptions.map((benefit) => (
												<label
													key={benefit}
													className="dropdown-item flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
													<input
														type="checkbox"
														value={benefit}
														checked={formData.benefits.includes(benefit)}
														onChange={handleCheckboxChange}
														className="mr-2 checked:!bg-blue-800 focus:ring-0 focus:ring-offset-0"
													/>
													{benefit === "remote"
														? "Remote Recording"
														: benefit === "air"
														? "Air Conditioning"
														: benefit === "parking"
														? "Parking"
														: benefit === "wifi"
														? "WiFi"
														: ""}
												</label>
											))}
										</div>
									)}
								</div>
								<Select
									className="w-full md:w-56"
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
							</div> */}
							<div className="flex flex-col md:flex-row gap-2 md:gap-4">
								<TextInput
									className="flex-grow w-full"
									type="text"
									name="searchTerm"
									placeholder="Buscar"
									value={formData.searchTerm}
									onChange={handleChange}
								/>
								<Button
									className="w-full md:w-44 focus:ring-1"
									gradientDuoTone={"purpleToPink"}
									onClick={() => handleSearch(formData)} // Pass current formData directly
								>
									Buscar
								</Button>
							</div>
						</div>
					</div>
					<h1 className="font-semibold text-center text-lg md:text-3xl ">
						Resultados de la búsqueda
					</h1>
					{searchResults.length > 0 && (
						<>
							<Select
								className="w-full md:w-52 self-end lg:mr-36"
								value={formData.sort}
								onChange={(e) => {
									setFormData((prevFormData) => {
										const updatedFormData = {
											...prevFormData,
											sort: e.target.value,
										};
										handleSearch(updatedFormData); // Pass the updated state to handleSearch if necessary
										return updatedFormData;
									});
								}}>
								<option value="desc">Último estudio</option>
								<option value="asc">Estudio más antiguo</option>
								<option value="priceDesc">Precio más alto</option>
								<option value="priceAsc">Precio más bajo</option>
								<option value="facilityDesc">Beneficios más altos</option>
								<option value="facilityAsc">Beneficios más bajos</option>
							</Select>

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
