import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { MdCancelPresentation } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CommentSection = ({ studioId }) => {
	const { currentUser } = useSelector((state) => state.user);
	const [comment, setComment] = useState("");
	const [commentErrorMsg, setCommentErrorMsg] = useState(null);
	const [comments, setComments] = useState([]);
	const navigate = useNavigate();
	const { theme } = useSelector((state) => state.theme);
	const [showModal, setShowModal] = useState(false);
	const [commentToDelete, setCommentToDelete] = useState(null);
	const [showMore, setShowMore] = useState(true);
	const [totalComments, setTotalComments] = useState(0);

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		setCommentErrorMsg(null);

		if (comment?.length > 200) {
			return setCommentErrorMsg("Length must less than 200 characters");
		}

		try {
			const res = await fetch("/api/comment/create-comment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: comment,
					studioId,
					userId: currentUser._id,
				}),
			});
			const data = await res.json();
			if (res.ok) {
				setComment("");
				setComments([data, ...comments]);
				setTotalComments(totalComments + 1);

				try {
					const res = await fetch(
						`/api/comment/get-postComments?studioId=${studioId}&limit=5`
					);
					const data = await res.json();
					if (res.ok) {
						setComments(data);
						if (data.length < 5) {
							setShowMore(false);
						}
					} else {
						console.log(data.message);
					}
				} catch (error) {
					console.log(error.message);
				}
			} else {
				setCommentErrorMsg(data.message);
			}
		} catch (error) {
			setCommentErrorMsg(error.message);
		}
	};

	useEffect(() => {
		const getComments = async () => {
			try {
				const res = await fetch(
					`/api/comment/get-postComments?studioId=${studioId}&limit=5`
				);
				const data = await res.json();
				if (res.ok) {
					setComments(data);
					if (data.length < 5) {
						setShowMore(false);
					}
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		getComments();
	}, [studioId]);

	useEffect(() => {
		const getTotalComments = async () => {
			try {
				const res = await fetch(
					`/api/comment/countTotalCommentsByStudio/${studioId}`
				);
				const data = await res.json();
				if (res.ok) {
					setTotalComments(data);
				} else {
					console.log(data.message);
				}
			} catch (error) {
				console.log(error.message);
			}
		};

		getTotalComments();
	}, [studioId]);

	const handleShowMore = async () => {
		const startIndex = comments.length;
		try {
			const res = await fetch(
				`/api/comment/get-postComments?studioId=${studioId}&startIndex=${startIndex}&limit=5`
			);
			const data = await res.json();
			if (res.ok) {
				setComments((prevComments) => [...prevComments, ...data]);
				if (data.length < 5) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleLike = async (commentId) => {
		try {
			if (!currentUser) {
				navigate("/sign-in");
				return;
			}
			const res = await fetch(`/api/comment/like-comment/${commentId}`, {
				method: "PUT",
			});
			const data = await res.json();
			if (res.ok) {
				setComments(
					comments.map((comment) =>
						comment._id === commentId
							? {
									...comment,
									likes: data.likes,
									numberOfLikes: data.likes.length,
							  }
							: comment
					)
				);
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleEditSubmit = async (comment, editedContent) => {
		setComments(
			comments.map((c) =>
				c._id === comment._id ? { ...c, content: editedContent } : c
			)
		);
	};

	const handleDeleteSubmit = async (commentId) => {
		setShowModal(false);

		try {
			if (!currentUser) {
				navigate("/sign-in");
				return;
			}
			const res = await fetch(`/api/comment/delete-comment/${commentId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (res.ok) {
				setComments(comments.filter((c) => c._id !== commentId));
				setTotalComments(totalComments - 1);
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="max-w-2xl mx-auto w-full p-3">
			{currentUser ? (
				<>
					<div className="flex items-center gap-1 my-3 text-gray-500 text-sm pl-3">
						<p>Signed in as:</p>
						<img
							className="h-5 w-5 object-cover rounded-full ml-1"
							src={currentUser.profilePicture}
							alt=""
						/>
						<Link
							to={"/dashboard?tab=profile"}
							className="text-xs text-cyan-600 hover:underline">
							@{currentUser.name}
						</Link>
					</div>
					<form
						onSubmit={handleCommentSubmit}
						className="bg-transparent border-2 border-white/40 dark:border-white/20 
                            backdrop-blur-[9px] rounded-lg shadow-xl p-3 dark:shadow-whiteLg">
						<Textarea
							placeholder="Add a comment..."
							rows="3"
							maxLength="200"
							value={comment}
							onChange={(e) => {
								setComment(e.target.value);
								setCommentErrorMsg(null);
							}}
						/>
						<div className="flex justify-between items-center mt-3 p-1">
							<p className="text-gray-500 text-xs">
								{200 - comment?.length} characters remaining
							</p>
							<Button
								outline
								gradientDuoTone="purpleToBlue"
								type="submit"
								className="focus:ring-1">
								Submit
							</Button>
						</div>
						{commentErrorMsg && (
							<Alert
								className="flex-auto mt-2"
								color="failure"
								withBorderAccent>
								<div className="flex justify-between">
									<span>{commentErrorMsg}</span>
									<span className="w-5 h-5">
										<MdCancelPresentation
											className="cursor-pointer w-6 h-6"
											onClick={() => {
												setCommentErrorMsg(null);
											}}
										/>
									</span>
								</div>
							</Alert>
						)}
					</form>
				</>
			) : (
				<div className="text-sm text-teal-500 my-5 flex gap-2 dark:text-gray-500 ml-3">
					<p>You mush signed in to comment.</p>
					<Link className="text-blue-500 hover:underline" to={"/sign-in"}>
						Sign In
					</Link>
				</div>
			)}
			{comments.length === 0 ? (
				<p className="text-sm mt-7 mb-5 ml-3">No comments yet</p>
			) : (
				<>
					<div className="text-sm mt-7 mb-5 flex items-center gap-1 ml-3">
						<p>Comments</p>
						<div className="border border-gray-400 py-1 px-2 rounded-sm">
							<p>{totalComments}</p>
						</div>
					</div>
					{comments.map((comment) => (
						<Comment
							key={comment._id}
							comment={comment}
							onLike={handleLike}
							onEdit={handleEditSubmit}
							onDelete={(commentId) => {
								setShowModal(true);
								setCommentToDelete(commentId);
							}}
						/>
					))}
					{showMore && (
						<div className="flex w-full my-3">
							<button
								onClick={handleShowMore}
								className="text-teal-400 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-500 mx-auto text-sm pb-4">
								Show more
							</button>
						</div>
					)}

					<Modal
						className={`${theme}`}
						show={showModal}
						onClose={() => {
							setShowModal(false);
						}}
						popup
						size="lg">
						<Modal.Header />
						<Modal.Body>
							<form
								className={`flex flex-col text-center ${theme}`}
								onSubmit={(e) => {
									e.preventDefault();
									handleDeleteSubmit(commentToDelete);
								}}>
								<div className="flex items-center mb-8 gap-8 self-center">
									<HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200" />
									<span className="text-2xl text-gray-600 dark:text-gray-200">
										Delete Comment
									</span>
								</div>
								<h3 className="my-5 text-lg text-gray-600 dark:text-gray-300">
									Are you sure you want to delete this comment?
								</h3>
								<div className="flex justify-around">
									<Button
										type="submit"
										color="failure"
										className="focus:ring-1">
										{"Yes, i'm sure"}
									</Button>
									<Button
										type="button"
										color="gray"
										onClick={() => setShowModal(false)}
										className="focus:ring-1 dark:text-gray-300">
										No, cancel
									</Button>
								</div>
							</form>
						</Modal.Body>
					</Modal>
				</>
			)}
		</div>
	);
};

export default CommentSection;
