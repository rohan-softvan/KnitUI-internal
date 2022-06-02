import React from "react";

function OptionsTab({optionsConfig, handleChange}) {
    return (
        <div className="wdr-ui-row">
            <div className="wdr-ui-col-4">
                <div className="wdr-title-2">Grand totals</div>
                <ul className="wdr-radiobtn-list">
                    <li>
                        <div className="wdr-radio-wrap">
                            <input
                                type="radio"
                                name="wdr-grand-totals-1650358735631"
                                id="wdr-gt-1"
                                value="off"
                                onChange={() => handleChange("grandTotal", "off")}
                                checked={optionsConfig.grandTotal === "off"}
                            />
                            <label htmlFor="wdr-gt-1">Do not show grand totals</label>
                        </div>
                    </li>
                    <li>
                        <div className="wdr-radio-wrap">
                            <input
                                type="radio"
                                name="wdr-grand-totals-1650358735631"
                                id="wdr-gt-2"
                                value="on"
                                onChange={() => handleChange("grandTotal", "on")}
                                checked={optionsConfig.grandTotal === "on"}
                            />
                            <label htmlFor="wdr-gt-2">Show grand totals</label>
                        </div>
                    </li>
                    <li>
                        <div className="wdr-radio-wrap">
                            <input
                                type="radio"
                                name="wdr-grand-totals-1650358735631"
                                id="wdr-gt-3"
                                value="rows"
                                onChange={() => handleChange("grandTotal", "rows")}
                                checked={optionsConfig.grandTotal === "rows"}
                            />
                            <label htmlFor="wdr-gt-3">Show for rows only</label>
                        </div>
                    </li>
                    <li>
                        <div className="wdr-radio-wrap">
                            <input
                                type="radio"
                                name="wdr-grand-totals-1650358735631"
                                id="wdr-gt-4"
                                value="columns"
                                onChange={() => handleChange("grandTotal", "columns")}
                                checked={optionsConfig.grandTotal === "columns"}
                            />
                            <label htmlFor="wdr-gt-4">Show for columns only</label>
                        </div>
                    </li>
                </ul>
            </div>
                <div className="wdr-ui-col-4">
                    <div className="wdr-title-2">Subtotals</div>
                    <ul className="wdr-radiobtn-list">
                        <li>
                            <div className="wdr-radio-wrap">
                                <input
                                    type="radio"
                                    name="wdr-subtotals-1650358735634"
                                    id="wdr-st-1"
                                    value="off"
                                    onChange={() => handleChange("subTotals", "off")}
                                    checked={optionsConfig.subTotals === "off"}
                                />
                                <label htmlFor="wdr-st-1">Do not show subtotals</label>
                            </div>
                        </li>
                        <li>
                            <div className="wdr-radio-wrap">
                                <input
                                    type="radio"
                                    name="wdr-subtotals-1650358735634"
                                    id="wdr-st-2"
                                    value="on"
                                    onChange={() => handleChange("subTotals", "on")}
                                    checked={optionsConfig.subTotals === "on"}
                                />
                                <label htmlFor="wdr-st-2">Show subtotals</label>
                            </div>
                        </li>
                        <li>
                            <div className="wdr-radio-wrap">
                                <input
                                    type="radio"
                                    name="wdr-subtotals-1650358735634"
                                    id="wdr-st-3"
                                    value="rows"
                                    onChange={() => handleChange("subTotals", "rows")}
                                    checked={optionsConfig.subTotals === "rows"}
                                />
                                <label htmlFor="wdr-st-3">Show subtotal rows only</label>
                            </div>
                        </li>
                        <li>
                            <div className="wdr-radio-wrap">
                                <input
                                    type="radio"
                                    name="wdr-subtotals-1650358735634"
                                    id="wdr-st-4"
                                    value="columns"
                                    onChange={() => handleChange("subTotals", "columns")}
                                    checked={optionsConfig.subTotals === "columns"}
                                />
                                <label htmlFor="wdr-st-4">Show subtotal columns only</label>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="wdr-ui-col-4">
                    <div className="wdr-title-2">Layout</div>
                    <ul className="wdr-radiobtn-list">
                        <li>
                            <div className="wdr-radio-wrap">
                                <input
                                    type="radio"
                                    name="wdr-layout-1650358735631"
                                    id="wdr-lt-1"
                                    value="compact"
                                    onChange={() => handleChange("layout", "compact")}
                                    checked={optionsConfig.layout === "compact"}
                                />
                                <label htmlFor="wdr-lt-1">Compact form</label>
                            </div>
                        </li>
                        <li>
                            <div className="wdr-radio-wrap">
                                <input
                                    type="radio"
                                    name="wdr-layout-1650358735631"
                                    id="wdr-lt-2"
                                    value="classic"
                                    onChange={() => handleChange("layout", "classic")}
                                    checked={optionsConfig.layout === "classic"}
                                />
                                <label htmlFor="wdr-lt-2">Classic form</label>
                            </div>
                        </li>
                        {/* <li>
                            <div className="wdr-radio-wrap">
                                <input
                                    type="radio"
                                    name="wdr-layout-1650358735631"
                                    id="wdr-lt-3"
                                    value="flat"
                                    onChange={() => handleChange("layout", "flat")}
                                    checked={optionsConfig.layout === "flat"}
                                />
                                <label htmlFor="wdr-lt-3">Flat form</label>
                            </div>
                        </li> */}
                    </ul>
                </div>
            </div>
    );
}

export default OptionsTab;
