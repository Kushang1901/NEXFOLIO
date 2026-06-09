const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendWelcomeEmail(to, name) {
    await transporter.sendMail({
        from: `"Nexfolio" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Welcome to Nexfolio 🎉",
        html: `
            <div style="font-family: Arial; padding: 20px">
                <h2>Welcome ${name || "there"} 👋</h2>
                <p>
                    You have successfully joined <b>Nexfolio</b>.
                </p>
                <p>
                    Start building your professional resume today!
                </p>
                <br />
                <strong>– Nexfolio Team</strong>
            </div>
        `
    });
}

module.exports = sendWelcomeEmail;
