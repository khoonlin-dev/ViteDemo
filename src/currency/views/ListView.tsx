import React from "react";
import "./ListView.css";

export type CurrencyInfo = {
    name: string;
    unit: string;
    type: string;
    value: number;
};

/**
 * I know we could have calculated **endIndex** here but peer component also need this value, so moved it to higher order
 */
export type ListViewProps = {
    currencyMap: Record<string, CurrencyInfo>;
    startIndex: number;
    endIndex: number;
    pageSize: number;
};

// A series of tests that need not to be carried out if the arguments never changed
function useErrorChecking(
    listSize: number,
    startIndex: number,
    endIndex: number
) {
    return React.useCallback(() => {
        if (startIndex < 0) {
            throw new Error(`Error code 1303. 1: ${startIndex}`);
        }
        if (endIndex < 0) {
            throw new Error(`Error code 1304. 1: ${endIndex}`);
        }
        if (startIndex > endIndex) {
            throw new Error(
                `Error code 1300. 1: ${startIndex} | 2: ${endIndex}`
            );
        }
        if (listSize === 0) return;
        if (startIndex >= listSize) {
            throw new Error(
                `Error code 1301. 1: ${startIndex} | 2: ${listSize}`
            );
        }
        if (endIndex >= listSize) {
            throw new Error(`Error code 1302. 1: ${endIndex} | 2: ${listSize}`);
        }
    }, [listSize, startIndex, endIndex]);
}

export default function ListView(props: ListViewProps) {
    const { currencyMap, startIndex, endIndex, pageSize } = props;
    const currencyList = Object.entries(currencyMap);
    useErrorChecking(currencyList.length, startIndex, endIndex)();
    const listItem: JSX.Element[] = [];
    for (let i = startIndex, j = i + pageSize; i < j; i++) {
        if (i > endIndex || currencyList.length === 0) {
            listItem.push(
                <div
                    className="list-view-item"
                    key={`list-item-filler-${i}`}
                ></div>
            );
        } else {
            const [key, info] = currencyList[i];
            const { name, unit, type, value } = info;
            listItem.push(
                <div className="list-view-item" key={`list-item-${key}`}>
                    <div className="list-view-item-name">{name}</div>
                    <div className="list-view-item-unit">{unit}</div>
                    <div className="list-view-item-type">{type}</div>
                    <div className="list-view-item-value">
                        {value.toFixed(3)}
                    </div>
                </div>
            );
        }
    }
    return <div className="list-view">{listItem}</div>;
}
