import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import {
	Alert,
	Button,
	FileInput,
	Label,
	Table,
	TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { MdCancelPresentation } from "react-icons/md";
// import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import { useSelector } from "react-redux";

const DashAdmin = () => {
	const [formData, setFormData] = useState({
		recommended: [],
		pdfs: [],
	});
	const [speakers, setSpeakers] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [addRemoveError, setAddRemoveError] = useState(null);
	const [updatedMsg, setUpdatedMsg] = useState(null);
	const [updatedError, setUpdatedError] = useState(null);
	const [pdfFile, setPdfFile] = useState(null);
	const [pdfUploadErrorMsg, setPdfUploadErrorMsg] = useState(null);
	const [pdfUploading, setPdfUploading] = useState(false);
	const [prevUrlData, setPrevUrlData] = useState([]);
	const { currentUser } = useSelector((state) => state.user);
	const [users, setUsers] = useState([]);
	const [showMoreUsers, setShowMoreUsers] = useState(true);
	const [freePremiumError, setFreePremiumError] = useState(null);

	console.log(formData);

	useEffect(() => {
		const fetchStorage = async () => {
			try {
				const response = await fetch("/api/storage/get-storage");
				const data = await response.json();
				setFormData(data);
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchStorage();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUpdatedMsg(null);
		setUpdatedError(null);
		try {
			if (!formData.found) {
				console.log(formData.found);
				const res = await fetch(`/api/storage/create-storage`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok) {
					console.log(data.message);
				} else {
					setFormData(data);
					prevUrlData.map((item, index) => deleteFileByUrl(item));
					return setUpdatedMsg("Actualizado exitosamente");
				}
			}
			if (formData.found) {
				const res = await fetch(`/api/storage/update-storage`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok) {
					console.log(data.message);
				} else {
					setFormData(data);
					prevUrlData.map((item, index) => deleteFileByUrl(item));
					return setUpdatedMsg("Actualizado exitosamente");
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchSpeaker();
	}, []);

	const fetchSpeaker = async () => {
		// console.log(voiceType, country);
		try {
			const response = await fetch(
				`/api/speaker/getspeakers?&sort=${"desc"}&limit=10`
			);
			const data = await response.json();
			// console.log(data);
			setSpeakers(data);
			if (data.length < 10) {
				setShowMore(false);
			}
		} catch (error) {
			console.error("Failed to fetch speaker", error);
		}
	};

	const handleShowMore = async () => {
		try {
			const startIndex = speakers.length;
			const response = await fetch(
				`/api/speaker/getspeakers?startIndex=${startIndex}&sort=${"desc"}&limit=10`
			);
			const data = await response.json();
			// console.log(data);
			if (data.length < 10) {
				setShowMore(false);
			}
			setSpeakers([...speakers, ...data]);
		} catch (error) {
			console.error("Failed to fetch speaker", error);
		}
	};

	const handleAddSpeaker = (speakerId) => {
		if (formData.recommended?.length === 6) {
			return setAddRemoveError(
				"Puedes agregar hasta 6 parlantes a los recomendados."
			);
		}
		setFormData({
			...formData,
			recommended: [...formData.recommended, speakerId],
		});
	};
	const handleRemoveSpeaker = (speakerId) => {
		setFormData({
			...formData,
			recommended: formData.recommended.filter((id, index) => id !== speakerId),
		});
	};

	const handleUploadPdf = async () => {
		setPdfUploadErrorMsg(null);
		setPdfUploading(true);
		try {
			if (!pdfFile || pdfFile.length === 0) {
				setPdfUploadErrorMsg("Seleccione un archivo PDF.");
				setPdfUploading(false);
				return;
			}
			if (pdfFile.length + formData.pdfs?.length > 6) {
				setPdfUploadErrorMsg("Puede cargar hasta 6 archivos PDF");
				setPdfUploading(false);
				return;
			}

			for (let i = 0; i < pdfFile.length; i++) {
				if (pdfFile[i].size >= 20 * 1024 * 1024) {
					setPdfUploadErrorMsg(
						"El tamaño del archivo PDF debe ser inferior a 20 MB."
					);
					setPdfUploading(false);
					return;
				}
			}

			const promises = [];

			for (let i = 0; i < pdfFile.length; i++) {
				promises.push(storePdf(pdfFile[i]));
			}

			Promise.all(promises)
				.then((urls) => {
					setFormData({
						...formData,
						pdfs: formData.pdfs.concat(urls),
					});
					setPdfUploadErrorMsg(null);
					setPdfUploading(false);
				})
				.catch((err) => {
					setPdfUploadErrorMsg(err);
					setPdfUploading(false);
				});
		} catch (error) {
			setPdfUploadErrorMsg(error.message);
			setPdfUploading(false);
		}
	};

	const storePdf = async (pdf) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + pdf.name;
			const stoageRef = ref(storage, fileName);
			const metadata = {
				customMetadata: {
					uid: currentUser.firebaseId,
				},
			};
			const uploadTask = uploadBytesResumable(stoageRef, pdf, metadata);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log(`Upload is ${progress}% done`);
				},
				(error) => {
					reject(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downlaodURL) => {
						resolve(downlaodURL);
					});
				}
			);
		});
	};

	const handleRemovePdf = (index, url) => {
		setFormData({
			...formData,
			pdfs: formData.pdfs.filter((x, i) => i !== index),
		});
		setPrevUrlData([...prevUrlData, url]);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		// console.log(voiceType, country);
		try {
			const response = await fetch(
				`/api/user/getusers?&sort=${"desc"}&limit=10`
			);
			const data = await response.json();
			// console.log(data);
			setUsers(data.users);
			if (data.users.length < 10) {
				setShowMoreUsers(false);
			}
		} catch (error) {
			console.error("Failed to fetch speaker", error);
		}
	};

	const handleShowMoreUsers = async () => {
		try {
			const startIndex = speakers.length;
			const response = await fetch(
				`/api/user/getusers?startIndex=${startIndex}&sort=${"desc"}&limit=10`
			);
			const data = await response.json();
			// console.log(data);
			if (data.users.length < 10) {
				setShowMoreUsers(false);
			}
			setUsers([...users, ...data.users]);
		} catch (error) {
			console.error("Failed to fetch speaker", error);
		}
	};

	const handlePremiumUser = async (userId) => {
		try {
			const res = await fetch(`/api/user/makePremium/${userId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (res.ok) {
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user._id === userId ? { ...user, isPremium: true } : user
					)
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	const handleFreeUser = async (userId) => {
		try {
			const res = await fetch(`/api/user/makeFree/${userId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (res.ok) {
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user._id === userId ? { ...user, isPremium: false } : user
					)
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div
			className="w-full bg-cover bg-center
			bg-[url('../../bg-light.jpg')] dark:bg-[url('../../bg2-dark.jpg')]">
			<div
				className="max-w-6xl my-5 sm:my-10 mx-3 p-3 sm:mx-12 lg:mx-auto sm:p-10 self-center dark:shadow-whiteLg
			bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[20px] rounded-lg shadow-xl">
				<h2 className="self-center text-2xl text-center font-semibold">
					Sólo para administrador
				</h2>
				<form className="my-10 flex flex-col gap-10" onSubmit={handleSubmit}>
					<div className="bg-transparent border-2 border-white/20 backdrop-blur-[20px] rounded-lg shadow-md p-3 flex flex-col gap-2  dark:shadow-whiteLg"></div>
					<Button
						type="submit"
						gradientDuoTone="purpleToPink"
						outline
						className="focus:ring-1 uppercase">
						Confirmar
					</Button>
				</form>
				{updatedMsg && (
					<Alert className="flex-auto" color="success" withBorderAccent>
						<div className="flex justify-between">
							<span>{updatedMsg}</span>
							<span className="w-5 h-5">
								<MdCancelPresentation
									className="cursor-pointer w-6 h-6"
									onClick={() => setUpdatedMsg(null)}
								/>
							</span>
						</div>
					</Alert>
				)}
			</div>
		</div>
	);
};

export default DashAdmin;

// Function to delete a file using its URL
const deleteFileByUrl = async (fileUrl) => {
	const storage = getStorage();

	try {
		// Extract the file path from the URL
		const startIndex = fileUrl.indexOf("/o/") + 3;
		const endIndex = fileUrl.indexOf("?alt=media");

		const filePath = decodeURIComponent(
			fileUrl.substring(startIndex, endIndex)
		);

		// Create a reference to the file to delete
		const fileRef = ref(storage, filePath);

		// Delete the file
		await deleteObject(fileRef);
		console.log("File deleted successfully");
	} catch (error) {
		console.error("Error deleting file:", error.message);
	}
};
