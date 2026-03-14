import "../assets/css/loader.css";



const CookingLoader = () => {
    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full bg-primary overflow-hidden">


            {/* Pot */}
            <div className="pot">
                <div className="lid"></div>
                <div className="handle"></div>

                <div className="steam steam-1"></div>
                <div className="steam steam-2"></div>
                <div className="steam steam-3"></div>
            </div>

            <p className="loading-text mt-4">Cooking...</p>
        </div>
    );
};

export default CookingLoader;
