import axios from "axios";

const mailTransporter = async (
    to: string,
    message: string,
    subject: string,
) => {
    try {
        let data = JSON.stringify({
            to: to,
            name: "Vsave",
            subject: subject,
            message: message,
        });

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://eedu.tech/api/v1/mail/send",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: data,
        };
        const sentMail = await axios.request(config);
        return sentMail;
    } catch (err: any) {
        console.log("err:", err);
        throw err;
    }
};

export default mailTransporter;
