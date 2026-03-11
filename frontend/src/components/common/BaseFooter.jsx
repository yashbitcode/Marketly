import { Search } from "lucide-react";
import { Button, Container, Input } from "./";
import { FOOTER_LINKS, SOCIAL_MEDIA } from "../../utils/constants";

const BaseFooter = () => {
    return (
        <div className="bg-green font-inter">
            <Container className="px-4 py-10 max-w-6xl mx-auto flex justify-between max-[860px]:flex-col gap-10">
                <div>
                    <h1 className="text-xl font-medium text-base-white">
                        Get Quality Products By Great Sellers
                    </h1>

                    <div className="mt-5">
                        <span className="italic text-base-white">We Are Ready To Help</span>
                        <div className="w-full border-2 rounded-base mt-2 border-gray-200 gap-1.5 bg-base-white p-1 flex items-center max-w-90">
                            <Search className="text-gray-400" />
                            <Input className="w-full p-0 border-0" placeholder="Enter Your Email" />
                            <Button className="bg-orange rounded-[8px]">Subscribe</Button>
                        </div>
                    </div>

                    <div className="mt-7">
                        <h1 className="text-xl font-medium text-base-white">Social Media</h1>

                        <div className="flex gap-4 mt-2">
                            {SOCIAL_MEDIA.map((el, idx) => (
                                <div
                                    key={idx}
                                    className={`size-10 flex justify-center rounded-full items-center ${el.bgColor}`}
                                >
                                    {<el.icon strokeWidth={1.5} className="text-base-white" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 max-sm:grid-cols-1 text-base-white">
                    <div>
                        <h1 className="italic text-xl">Information</h1>
                        <ul className="flex flex-col gap-4 mt-5">
                            {FOOTER_LINKS.information.map((el) => (
                                <li key={el.title}>{el.title}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h1 className="italic text-xl">Quick Links</h1>
                        <ul className="flex flex-col gap-4 mt-5">
                            {FOOTER_LINKS.quickLinks.map((el) => (
                                <li key={el.title}>{el.title}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Container>

            <div className="py-3 text-center italic text-base-white shadow-base shadow-base-white">
                © 2026 Marketly. Empowering sellers.{" "}
                <span className="text-orange">Connecting buyers.</span>
            </div>
        </div>
    );
};

export default BaseFooter;
