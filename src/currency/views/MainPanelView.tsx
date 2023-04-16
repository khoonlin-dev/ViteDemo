import PageDisplayPanelView, {
    PageDisplayPanelViewProps,
} from "./PageDisplayPanelView";
import PageSizeSelectPanelView, {
    PageSizeSelectPanelViewProps,
} from "./PageSizeSelectPanelView";
import "./MainPanelView.css";

type MainPanelViewProps = PageDisplayPanelViewProps &
    PageSizeSelectPanelViewProps & {
        doPageIncrement?: () => void;
        doPageDecrement?: () => void;
        doListUpdate: () => void;
    };

export default function MainPanelView(props: MainPanelViewProps) {
    const {
        listStartPos,
        listEndPos,
        totalListSize,
        pageSizeOptions,
        onPageSizeChange,
        doPageIncrement,
        doPageDecrement,
        doListUpdate,
    } = props;
    return (
        <div className="main-panel-view">
            <button onClick={doListUpdate}>{"Update"}</button>
            <PageDisplayPanelView
                {...{ listStartPos, listEndPos, totalListSize }}
            />
            <PageSizeSelectPanelView
                {...{ pageSizeOptions, onPageSizeChange }}
            />
            <div className="page-pick-holder">
                {doPageDecrement ? (
                    <button id="page-decrement" onClick={doPageDecrement}>
                        Prev
                    </button>
                ) : undefined}
            </div>
            <div className="page-pick-holder">
                {doPageIncrement ? (
                    <button id="page-increment" onClick={doPageIncrement}>
                        Next
                    </button>
                ) : undefined}
            </div>
        </div>
    );
}
