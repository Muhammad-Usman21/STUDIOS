import { useState, useEffect } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import StudioCard from "../components/StudioCard";

const Home = () => {
	const [formData, setFormData] = useState({
		searchTerm: "",
		sort: "desc",
	});
	const [showMore, setShowMore] = useState(true);
	const [searchResults, setSearchResults] = useState([]);
	const location = useLocation();
	const navigate = useNavigate(); // Replaces useHistory

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const searchTerm = params.get("searchTerm") || "";
		const sort = params.get("sort") || "desc";

		setFormData({ searchTerm, sort });

		fetchSearchResults({ searchTerm, sort });
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
			<div className="max-w-7xl mx-3 sm:mx-5 lg:mx-auto items-center justify-center flex flex-col gap-12 lg:gap-24 my-10 lg:my-24">
				<div className="flex flex-col items-center justify-center gap-4 md:gap-8 p-5 md:p-10 bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[20px] rounded-lg shadow-2xl dark:shadow-whiteLg">
					<span className="text-2xl md:text-4xl text-center">
						Capture Your Creative Moments
					</span>
					<span className="text-lg md:text-2xl text-center">
						Book Your Studio in Seconds!
					</span>
					<span className="text-lg md:text-2xl text-center px-5 mt-5">
						Search for affordable studios and start recording your best work
						today.
					</span>
					<div className="flex flex-col gap-2 md:gap-4 w-full">
						<div className="flex flex-col md:flex-row gap-2 md:gap-4">
							<TextInput
								className="flex-grow"
								type="text"
								name="searchTerm"
								placeholder="Search by Title or Address"
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
				</div>

				<div
					className="flex flex-col w-full items-center justify-center gap-6 lg:gap-10 p-3 lg:p-10 mb-10 
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[20px] rounded-lg shadow-2xl dark:shadow-whiteLg">
					<h1 className="font-semibold text-center text-3xl">
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
