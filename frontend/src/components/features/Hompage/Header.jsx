import { Button, Container, Input } from "../../common";
import { BadgeQuestionMark, Handshake, Search, ShoppingBag, } from "lucide-react";

const Header = () => {
    return (
        <div className="py-4 px-6 shadow-2xs w-full">
            <Container className="flex justify-between mx-auto">
                <div className="w-full max-w-23">
                    <img src="logo3.jpg" alt="logo" className="w-full object-cover" />
                </div>

                <div className="w-full max-w-4xl flex gap-3 items-center">
                    <div className="w-full border-2 rounded-full border-gray-200 gap-1.5 bg-base-white p-2 flex items-center max-w-130">
                        <Search className="text-gray-400" />
                        <Input className="w-full p-0 border-0" />
                        <Button className="bg-orange     ">Search</Button>
                    </div>
                    <div className="flex gap-3 items-center ml-5">
                        <div className=" bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange justify-center items-center p-2 rounded-full" to={"/"}>
                            <ShoppingBag strokeWidth={1.8} />
                        </div>
                        <div className="bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange justify-center items-center p-2 rounded-full" to={"/"}>
                            <Handshake strokeWidth={1.8} />
                        </div>
                        <div className="bg-base-white flex text-gray-500 hover:text-white transition-all hover:bg-orange  justify-center items-center p-2 rounded-full" to={"/"}>
                            <BadgeQuestionMark strokeWidth={1.8} />
                        </div>

                        <Button variant="secondary" className="border-gray-300 text-gray-600 hover:text-white hover:bg-orange hover:border-orange">Login</Button>
                        <Button variant="secondary" className="border-gray-300 text-gray-600 hover:text-white hover:bg-orange hover:border-orange">Sign Up</Button>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Header;