import CommentSection from "./CommentSection";

const Comments = ({ studioId }) => {
	return (
		<div className="min-h-screen w-full sm:px-10 ">
			<div
				className="flex sm:p-5 md:p-10 max-w-4xl w-full lg:mx-auto flex-col md:items-center gap-10
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-2xl dark:shadow-whiteLg">
				<CommentSection studioId={studioId} />
			</div>
		</div>
	);
};

export default Comments;
