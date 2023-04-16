import { OptionHTMLAttributes } from "react";
import "./PageSizeSelectPanelView.css";

export type PageSizeSelectPanelViewProps = {
    pageSizeOptions: {
        props?: OptionHTMLAttributes<HTMLOptionElement>;
        content: string;
    }[];
    defaultPageSize?: string;
    onPageSizeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function PageSizeSelectPanelView(
    props: PageSizeSelectPanelViewProps
) {
    const {
        pageSizeOptions: options,
        defaultPageSize: defaultValue,
        onPageSizeChange: onChange,
    } = props;
    const list: JSX.Element[] = [];

    let defaultValueExists = defaultValue === undefined;
    options.forEach((option) => {
        const props = option.props || { value: option.content };
        if (!defaultValueExists && props.value === defaultValue) {
            defaultValueExists = true;
        }
        list.push(
            <option
                {...props}
                key={`page-size-select-${option.content}`}
            >{`${option.content}`}</option>
        );
    });

    if (!defaultValueExists) {
        throw new Error(
            `Error code: 1400. 1: ${defaultValue as string} | 2: ${
                options.length
            }`
        );
    }

    return (
        <>
            <div className="page-size-select-desc">{"Rows per page:"}</div>
            <select
                className="page-size-select"
                defaultValue={defaultValue}
                onChange={onChange}
            >
                {list}
            </select>
        </>
    );
}
