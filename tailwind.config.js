module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontWeight: {
                bold: 800,
            },
            backgroundColor: {
                blue: "#1D0B18",
                lightbrown: "#321520",
            },
            color: {
                shade: "#F66F63",
            },
            fontFamily: {
                // body: ["Poppins"],
                heading: ["Berkshire Swash", "cursive"],
                body: ["Happy Monkey", "cursive"],
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
