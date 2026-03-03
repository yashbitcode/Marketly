import { Link } from "react-router";
import { Container } from "../../common";

const Hero = () => {
    return (
        <Container className="font-inter grid grid-rows-2 max-md:flex max-md:flex-col grid-cols-4 md-plus:h-135 mx-auto mt-8 max-w-292 gap-4 px-4">
            <div className="rounded-[14px] col-span-3 max-md-plus:col-span-4 p-7 bg-light-green w-full flex relative">
                <div className="flex flex-col gap-5 max-md-plus:items-center justify-center max-md-plus:text-center mx-auto">
                    <div>
                        <h1 className="text-4xl text-green font-semibold max-sm-440:text-2xl">
                            Discover Everything
                        </h1>
                        <h1 className="text-4xl text-green font-semibold pt-2 max-sm-440:text-2xl">
                            From Trusted Sellers
                        </h1>
                    </div>

                    <p className="text-gray-500 italic">
                        Shop electronics, fashion, home & more — all from
                        verified vendors in one place
                    </p>

                    <Link
                        to="/products"
                        className="uppercase bg-green px-3 py-1 rounded-full text-white w-fit"
                    >
                        shop now
                    </Link>
                </div>
                <div className="w-full max-w-200 relative -top-18 -right-13 max-md-plus:hidden">
                    <img src="vendor.svg" alt="vendor" className="w-full" />
                </div>
            </div>
            <div className="rounded-[14px] md-plus:row-span-2 max-md:col-span-4 max-md-plus:col-span-2 bg-amber-900/15 p-5 max-md-plus:order-2 overflow-hidden w-full relative flex flex-col  max-md-plus:text-center">
                <div className="flex flex-col gap-4 w-full max-md-plus:items-center justify-center max-md-plus:h-full">
                    <div>
                        <h1 className="text-2xl max-md-plus:text-3xl text-amber-900 font-semibold max-sm-440:text-2xl">
                            Trending Products
                        </h1>
                        <h1 className="text-2xl max-md-plus:text-3xl text-amber-900 font-semibold pt-1 max-sm-440:text-2xl">
                            At Unbeatable Prices
                        </h1>
                    </div>

                    <p className="text-gray-500 italic">
                        New arrivals from top-rated sellers daily
                    </p>

                    <Link
                        to="/products"
                        className="uppercase bg-amber-900 px-3 py-1 rounded-full text-white w-fit"
                    >
                        shop now
                    </Link>
                </div>
                <div className="w-80 absolute bottom-0 left-0 max-md-plus:hidden">
                    <img
                        src="product.png"
                        alt="product"
                        className="w-full max-w-80"
                    />
                </div>
            </div>
            <div className="rounded-[14px] col-span-2 bg-blue-500/15 p-4 flex items-center max-md:col-span-4">
                <div className="flex flex-col gap-4 w-full h-full max-md-plus:items-center justify-center max-md-plus:text-center mx-auto">
                    <div>
                        <h1 className="text-3xl text-blue-500 font-semibold max-sm-440:text-2xl">
                            Hot Deals
                        </h1>
                        <h1 className="text-3xl text-blue-500 font-semibold pt-1 max-sm-440:text-2xl">
                            Limited Time Only
                        </h1>
                    </div>

                    <p className="text-gray-500 italic">
                        Shop cool top-products with great quality
                    </p>

                    <Link
                        to="/products"
                        className="uppercase bg-blue-500 px-3 py-1 rounded-full text-white w-fit"
                    >
                        shop now
                    </Link>
                </div>

                <div className="w-full max-w-120 max-md-plus:hidden">
                    <img src="sample.png" alt="product" className="w-full" />
                </div>
            </div>

            <div className="rounded-[14px] bg-orange/15 flex justify-center items-center flex-col p-4 max-md-plus:hidden">
                <h1 className="text-2xl text-orange font-semibold">
                    Quality Products
                </h1>
                <div className="w-full max-w-120">
                    <img
                        src="fancy.svg"
                        alt="product"
                        className="w-full max-w-80"
                    />
                </div>

                <Link
                    to="/products"
                    className="uppercase bg-orange px-3 py-1 rounded-full text-white w-fit"
                >
                    shop now
                </Link>
            </div>
        </Container>
    );
};

export default Hero;
