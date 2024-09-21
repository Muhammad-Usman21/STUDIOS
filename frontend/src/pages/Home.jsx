import { useState, useEffect } from "react";
import { Button, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import StudioCard from "../components/StudioCard";

const Home = () => {
    const [formData, setFormData] = useState({
        city: "",
        title: "",
        description: ""
    });
    const [showMore, setShowMore] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const location = useLocation();
    const navigate = useNavigate(); // Replaces useHistory

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Parse URL search params on component mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        console.log(params.toString());
        const city = params.get("city") || "";
        const title = params.get("title") || "";
        const description = params.get("description") || "";

        console.log(city, title, description);

        // Set the form data from URL params
        setFormData({ city, title, description });

        fetchSearchResults({ city, title, description });
    }, [location]);


    // Fetch search results based on formData or URL params
    const fetchSearchResults = async (searchData) => {
        let queryParams = new URLSearchParams(searchData).toString();
        queryParams += "&startIndex=0&limit=9";
        console.log(queryParams);
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
        console.log(query);

        // Update URL without refreshing the page
        navigate(`?${query}`, { replace: true }); // Replaces history.push()

        // Fetch search results
        fetchSearchResults(formData);
    };

    const handleShowMore = async () => {
        try {
            const queryParams = new URLSearchParams(formData).toString();
            const startIndex = searchResults.length;
            const limit = 9;
            const response = await fetch(`/api/studio/search?${queryParams}&startIndex=${startIndex}&limit=${limit}`);
            const data = await response.json();
            if (data, length < 9) {
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
                <div
                    className="flex flex-col items-center justify-center gap-4 md:gap-8 p-5 md:p-10
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-2xl dark:shadow-whiteLg">
                    <span className="text-2xl md:text-4xl text-center">
                        LOCUCIONES PROFESIONALES
                    </span>
                    <span className="text-lg md:text-2xl text-center">
                        Locución Profesional, Locución Comercial, Institucional Voz en off
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 md:gap-8 p-5 md:p-10 bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-2xl dark:shadow-whiteLg">
                    <span className="text-lg md:text-2xl text-center px-5">Search the Studios</span>
                    <div className="flex flex-col gap-2 md:gap-4">
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                            <TextInput
                                className="flex-grow"
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                            />
                            <TextInput
                                className="flex-grow"
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                            <TextInput
                                className="flex-grow"
                                type="text"
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                            <Button
                                className="w-60 md:w-36 focus:ring-1"
                                gradientDuoTone={"purpleToPink"}
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </div>

                <div
                    className="flex flex-col w-full items-center justify-center gap-6 lg:gap-10 p-3 lg:p-10 mb-10 
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[9px] rounded-lg shadow-2xl dark:shadow-whiteLg">
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
                    {searchResults.length === 0 && <p>No hay oradores para esta búsqueda.</p>}
                </div>
            </div>
        </div>
    );
};

export default Home;
