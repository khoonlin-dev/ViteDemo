import "./api/CurrencyAPI";
import { MainComponent } from "./MainComponent";

export default function CurrencyApp() {
    return (
        <>
            <div
                style={{
                    width: "100%",
                    backgroundColor: "gray",
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: "15px",
                }}
            >
                RATES
            </div>
            <MainComponent />
        </>
    );
}
