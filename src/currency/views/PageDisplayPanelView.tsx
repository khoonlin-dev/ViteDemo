import React from "react";
import "./PageDisplayPanelView.css";

export type PageDisplayPanelViewProps = {
    /**
     * note: it's POS not INDEX
     */
    listStartPos: number;
    /**
     * note: it's POS not INDEX
     */
    listEndPos: number;
    totalListSize: number;
};

function useErrorChecking(
    startPos: number,
    endPos: number,
    totalIndex: number
) {
    return React.useCallback(() => {
        if (startPos > endPos) {
            throw new Error(`Error code: 1300. 1: ${startPos} | 2: ${endPos}`);
        }
        if (startPos < 0) {
            throw new Error(`Error code 1303. 1: ${startPos}`);
        }
        if (endPos < 0) {
            throw new Error(`Error code 1304. 1: ${endPos}`);
        }
        if (totalIndex === 0) return;
        if (startPos > totalIndex) {
            throw new Error(
                `Error code: 1301. 1: ${startPos} | 2: ${totalIndex}`
            );
        }
        if (endPos > totalIndex) {
            throw new Error(
                `Error code: 1302. 1: ${endPos} | 2: ${totalIndex}`
            );
        }
    }, [startPos, endPos, totalIndex]);
}

export default function PageDisplayPanelView(props: PageDisplayPanelViewProps) {
    const { listStartPos, listEndPos, totalListSize } = props;
    //useErrorChecking(listStartPos, listEndPos, totalListSize)();
    return (
        <div className="page-display">{`${listStartPos} - ${listEndPos} of ${totalListSize}`}</div>
    );
}
