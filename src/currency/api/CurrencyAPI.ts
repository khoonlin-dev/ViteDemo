import APIClient from "../../model/APIClient";
import DataSource from "../../model/DataSource";

interface RawCurrencyResponse {
    rates: Record<string, never>;
}

APIClient.registerApiStrategy("get_currency", {
    url: "https://api.coingecko.com/api/v3/exchange_rates",
    responseType: "json",
    onCompleteWrap(onComplete) {
        return (value: RawCurrencyResponse) => {
            DataSource.set("currency", value.rates);
            // DataSource will apply a layer of mutability protection on its data
            onComplete && onComplete(DataSource.get("currency"));
        };
    },
});
