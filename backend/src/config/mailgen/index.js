const Mailgen = require("mailgen");

const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Marketly",
            link: "https://taskmanager.example.com",
        },
    });

    module.exports = mailGenerator;