import { VENDOR_FEATURES } from "../../../utils/constants";
import { Container } from "../../common";

const JoinAsSeller = () => {
    return (
        <div className="bg-green w-full py-15 font-inter">
            <h1 className="text-base-white text-5xl max-sm:text-4xl text-center font-semibold ">Join As A Seller</h1>
            <p className="text-base-white mt-4 text-center italic">Build Your Brand With Marketly</p>

            <Container className="flex mt-10 px-4 mx-auto justify-center gap-20 items-center">
                <div className="rounded-base overflow-hidden w-full bg-light-green max-w-120">
                    <img src="vendors.svg" alt="vendor" className="w-full" />
                </div>

                <div className="flex flex-col gap-5 text-base-white">
                    {
                        VENDOR_FEATURES.map((el) => (
                            <div className="flex flex-col gap-2 items-center text-center">
                                <div className="size-10 flex justify-center items-center rounded-full bg-light-green">
                                    {<el.icon className="text-green" strokeWidth={2.5} />}
                                </div>
                                <div>
                                    <h1 className="italic font-medium">{el.title}</h1>
                                    <span>{el.desc}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Container>
        </div>
    );
};

export default JoinAsSeller;