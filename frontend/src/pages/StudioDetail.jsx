import { useParams } from "react-router-dom";

const StudioDetail = () => {
    const { id } = useParams();
    const [studio, setStudio] = useState(null);

    useEffect(() => {
        const fetchStudio = async () => {
            const response = await fetch(`/api/studio/${id}`);
            const data = await response.json();
            setStudio(data);
        };
        fetchStudio();
    }, [id]);

    return (
        <div>
            <h1>Studio Detail Page</h1>
            <p>Studio ID: {id}</p>
        </div>
    );
};

export default StudioDetail;