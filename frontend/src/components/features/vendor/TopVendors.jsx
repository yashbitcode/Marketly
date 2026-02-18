import { Container } from "../../common";
import TopVendorCard from "./TopVendorCard";

const TopVendors = () => {
    return (
        <div className="my-20 font-inter">
            <h1 className="text-5xl  max-sm:text-4xl text-center font-semibold text-dark">Popular Sellers</h1>
            <p className="text-gray-600 mt-4 text-center italic">Get Quality Deals With Our Top Sellers</p>

            <Container className="mx-auto gap-4 mt-8 px-4 flex flex-wrap justify-center">

                {
                    Array.from({length: 5}).map((_, idx) => <TopVendorCard key={idx} storeImg={"https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"} storeName={"EasyFashion Ltd."} avgRating={3.7} />)
                }
            </Container>
        </div>
    );
};

export default TopVendors;