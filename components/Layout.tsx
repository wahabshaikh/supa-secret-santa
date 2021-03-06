import { FC } from "react";
import Header from "./Header";

const Layout: FC = ({ children }) => {
    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </>
    );
};

export default Layout;
