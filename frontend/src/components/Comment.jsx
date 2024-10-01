import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
	const { currentUser } = useSelector((state) => state.user);
	const [isEditing, setIsEdititng] = useState(false);
	const [editedContent, setEditedContent] = useState(comment.content);

	const handleEdit = () => {
		setIsEdititng(true);
		setEditedContent(comment.content);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					content: editedContent,
				}),
			});
			const data = await res.json();
			if (res.ok) {
				setIsEdititng(false);
				onEdit(comment, editedContent);
				return;
			} else {
				console.log(data.message);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="flex p-4 border-b dark:border-gray-600 text-sm">
			<div className="flex-shrink-0 mr-3">
				<img
					className="w-10 h-10 object-cover rounded-full bg-gray-200"
					src={comment.userId.profilePicture}
					alt={comment.userId.name}
				/>
			</div>
			<div className="flex-1">
				<div className="flex items-center mb-1">
					<span className="font-bold mr-1 text-xs truncate">
						{comment.userId ? `@${comment.userId.name}` : "anonymous user"}
					</span>
					<span className="dark:text-gray-400 text-gray-600 text-xs">
						{moment(comment.createdAt).fromNow()}
					</span>
				</div>
				{isEditing ? (
					<form onSubmit={handleEditSubmit}>
						<Textarea
							className="mb-2 mt-1"
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
						/>
						<div className="flex justify-end gap-2 text-xs">
							<Button
								type="submit"
								size="sm"
								gradientDuoTone="purpleToBlue"
								className="px-2 focus:ring-1">
								Save
							</Button>
							<Button
								type="button"
								size="sm"
								gradientDuoTone="purpleToBlue"
								outline
								onClick={() => setIsEdititng(false)}
								className="focus:ring-1">
								Cancel
							</Button>
						</div>
					</form>
				) : (
					<>
						<p className="dark:text-gray-400 text-gray-600 pb-2">
							{comment.content}
						</p>
						{currentUser && (
							<div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
								<button
									type="button"
									onClick={() => onLike(comment._id)}
									className={`dark:text-gray-300 text-gray-700 hover:text-blue-500 dark:hover:text-blue-500 ${
										currentUser &&
										comment.likes.includes(currentUser._id) &&
										"!text-blue-500"
									}`}>
									<FaThumbsUp className="text-sm" />
								</button>
								{comment.numberOfLikes > 0 && (
									<p className="dark:text-gray-300 text-gray-700">
										{comment.numberOfLikes +
											" " +
											(comment.numberOfLikes === 1 ? "like" : "likes")}
									</p>
								)}

								{currentUser &&
									(currentUser._id === comment.userId._id ||
										(currentUser.isAdmin && !user.isAdmin)) && (
										<div className="flex gap-2 ml-4">
											<button
												type="button"
												onClick={handleEdit}
												className="dark:text-gray-300 text-gray-700 hover:text-blue-500 dark:hover:text-blue-500">
												Edit
											</button>
											<button
												type="button"
												onClick={() => onDelete(comment._id)}
												className="dark:text-gray-300 text-gray-700 hover:text-red-500 dark:hover:text-red-500">
												Delete
											</button>
										</div>
									)}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Comment;
