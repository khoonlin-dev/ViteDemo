import React from "react";
import { ReactHookUtils } from "../utils/ReactHookUtils";
// Useful for catching error emitted by CHILD components
import { PureErrorBoundary } from "../utils/ErrorBoundary";
import ListView, { CurrencyInfo } from "./views/ListView";
import APIClient from "../model/APIClient";
import ErrorView from "../utils/ErrorView";
import MainPanelView from "./views/MainPanelView";
import "./MainComponent.css";

type CurrencyMap = Record<string, CurrencyInfo>;

type ReducerActions =
    | "update_list"
    | "increment_page"
    | "decrement_page"
    | "set_page_size"
    | "reset";

type CurrencyListComponentState = {
    pageSize: number;
    pageIndex: number;
    currencyData: CurrencyMap;
};

// Assume we are getting this from API...
const pageSizeSelectOption = [
    { props: { value: 5 }, content: "5" },
    { props: { value: 6 }, content: "6" },
    { props: { value: 7 }, content: "7" },
    { props: { value: 8 }, content: "8" },
    { props: { value: 9 }, content: "9" },
    { props: { value: 10 }, content: "10" },
];

function reducer(
    state: CurrencyListComponentState,
    action: {
        type: ReducerActions;
        payload?: Partial<CurrencyListComponentState>;
    }
) {
    const { type, payload } = action;
    switch (type) {
        case "update_list": {
            if (payload && payload.currencyData !== undefined) {
                return { ...state, currencyData: payload.currencyData };
            }
            return state;
        }
        case "increment_page": {
            return { ...state, pageIndex: state.pageIndex + 1 };
        }
        case "decrement_page": {
            return { ...state, pageIndex: state.pageIndex - 1 };
        }
        case "set_page_size": {
            if (payload && payload.pageSize !== undefined) {
                return { ...state, pageSize: payload.pageSize, pageIndex: 0 };
            }
            return state;
        }
        case "reset": {
            return { ...state, ...payload };
        }
        default: {
            return state;
        }
    }
}

export function MainComponent() {
    const [state, dispatch] = React.useReducer(reducer, {
        pageSize: 5,
        pageIndex: 0,
        currencyData: {},
    });
    const forceUpdate = ReactHookUtils.useForceUpdate();
    const [errRef, onErrorFallback, onSelfError, onChildError] =
        ReactHookUtils.useErrorHandling({
            state,
            onError: React.useCallback(
                () => {
                    forceUpdate();
                },
                // forceUpdate is never gonna change
                // eslint-disable-next-line react-hooks/exhaustive-deps
                []
            ),
            onFallback: React.useCallback(
                (data: CurrencyListComponentState) => {
                    dispatch({ type: "reset", payload: data });
                },
                []
            ),
        });
    // Data
    const { currencyData, pageSize, pageIndex } = state;
    const listLength = Object.keys(currencyData).length;
    // Cbs
    const onUpdate = React.useCallback(
        (value: CurrencyMap) => {
            if (!errRef.current) {
                dispatch({
                    type: "update_list",
                    payload: { currencyData: value },
                });
            }
        },
        // errRef is never gonna change
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    const onPageSizeChange = React.useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            event.stopPropagation();
            dispatch({
                type: "set_page_size",
                payload: { pageSize: +event.target.value },
            });
        },
        []
    );
    const onPageIncrement = React.useCallback(() => {
        dispatch({
            type: "increment_page",
        });
    }, []);
    const onPageDecrement = React.useCallback(() => {
        dispatch({
            type: "decrement_page",
        });
    }, []);
    const doUpdate = React.useCallback(
        () => {
            APIClient.sendRegisteredApi("get_currency", onUpdate, onSelfError);
        },
        // onUpdate is never gonna change
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onSelfError]
    );

    // componentDidMount
    // This is an one-time effect, executed when the FIRST render is completed (componentDidMount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(doUpdate, []);

    // render
    const { listStartIndex, listEndIndex } = React.useMemo(() => {
        const listStartIndex = pageIndex * pageSize;
        const listEndIndex =
            listStartIndex + pageSize >= listLength
                ? (listLength || 1) - 1
                : listStartIndex + pageSize - 1;
        return { listStartIndex, listEndIndex };
    }, [pageSize, pageIndex, listLength]);
    if (errRef.current) {
        return (
            <ErrorView
                error={errRef.current}
                fallback={{ action: onErrorFallback, buttonText: "Return" }}
            />
        );
    }
    return (
        <>
            <div className={"view-header"}>Rates</div>
            <div className={"main-view"}>
                <PureErrorBoundary onError={onChildError}>
                    <ListView
                        currencyMap={currencyData}
                        startIndex={listStartIndex}
                        endIndex={listEndIndex}
                        pageSize={pageSize}
                    />
                    <MainPanelView
                        listStartPos={
                            listLength ? listStartIndex + 1 : listLength
                        }
                        listEndPos={listLength ? listEndIndex + 1 : listLength}
                        pageSizeOptions={pageSizeSelectOption}
                        totalListSize={listLength}
                        onPageSizeChange={onPageSizeChange}
                        doPageIncrement={
                            listLength === 0 || listEndIndex === listLength - 1
                                ? undefined
                                : onPageIncrement
                        }
                        doPageDecrement={
                            listLength > 0 && pageIndex > 0
                                ? onPageDecrement
                                : undefined
                        }
                        doListUpdate={doUpdate}
                    />
                </PureErrorBoundary>
            </div>
        </>
    );
}
