import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: "95888f002@smtp-brevo.com",
        pass: "3aEOUfT4trsQwA1G",
    },
});

export default transporter;
