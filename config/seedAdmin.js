
const bcrypt = require("bcrypt");
const User = require("../models/User");

const seedAdmin = async () => {
    const name = process.env.ADMIN_NAME?.trim();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
        throw new Error(
            "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env"
        );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.role !== "admin") {
        throw new Error(
            `The configured admin email ${email} belongs to a non-admin account.`
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
        existingUser.name = name;
        existingUser.password = hashedPassword;
        await existingUser.save();

        console.log("Admin account and password synchronised.");
        return;
    }

    await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin"
    });

    console.log("Admin account seeded successfully.");
};

module.exports = seedAdmin;
