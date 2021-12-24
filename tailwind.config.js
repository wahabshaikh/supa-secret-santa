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
                pink: "#FB5D82",
                lightbrown: "#321520",
            },
            color: {
                shade: "#F66F63",
            },
            fontFamily: {
                body: ["Poppins"],
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
