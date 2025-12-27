import React from "react";
import Sidebar from "../components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex border-collapse">
            <Sidebar />
            <div className="">
                {children}
            </div>
        </div>
    )
}