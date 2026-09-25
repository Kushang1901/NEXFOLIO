import { redirect } from "next/navigation";

export const metadata = {
    title: "Disclaimer | CVGrid",
    robots: {
        index: false,
        follow: true,
    },
};

export default function DisclaimerRedirect() {
    redirect("https://cvgrid.in/disclaimer");
}
