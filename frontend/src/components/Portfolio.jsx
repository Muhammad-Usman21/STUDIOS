
const Portfolio = ({ images }) => {
    return (
        <div className="min-h-screen w-full">
            <div
                className="flex p-5 md:p-10 max-w-2xl mx-5 sm:mx-10 md:mx-20 lg:mx-auto flex-col md:items-center gap-10
				bg-transparent border-2 border-white/40 dark:border-white/20 backdrop-blur-[30px] rounded-lg shadow-2xl dark:shadow-whiteLg">
                {images.map((image, index) => (
                    <div className="w-full" key={index}>
                        <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                        <p className="text-sm lg:text-lg my-2 text-center">{image.name}</p>
                        <hr className="border-black dark:border-white"/>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default Portfolio;