import Mailgen from "mailgen";

const mailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Marketly",
        link: "https://taskmanager.example.com",
    },
});

export default mailGenerator;
