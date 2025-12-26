import { RxDividerVertical } from "react-icons/rx";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function DateRangeSelector({
  customSearch,
  viewOptions,
  handleRangeSubmit,
  noDataMessage,
  yesterdayStr,
  todayStr,
  customEndDateUI,
  customStartDateUI,
  setCustomStartDateUI,
  setCustomEndDateUI,
  setCustomSearch,
}) {
  console.log("VIEW OPTIONS: " + JSON.stringify(viewOptions, null, 2));
  return (
    <>
      {/* setting date ranges */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <button
            className="flex items-center cursor-pointer underline"
            onClick={() => setCustomSearch(!customSearch)}
          >
            <FaMagnifyingGlass />
            <p className="cursor-pointer">Custom Search</p>
          </button>
          <div className="flex items-center">
            <p>View:&nbsp; &nbsp;</p>
            {viewOptions.map((item) => (
              <>
                <button key={item} onClick={item.setter}>
                  <p className="cursor-pointer">{item.label}</p>
                </button>
                <RxDividerVertical />
              </>
            ))}
          </div>
        </div>
        {customSearch && (
          <>
            <hr className="border-gray-400 border-1" />
            <form
              className="flex flex-col max-w-xs"
              onSubmit={handleRangeSubmit}
            >
              <label>From</label>
              <input
                type="date"
                className="border-1 h-10 rounded-lg p-2"
                max={yesterdayStr}
                onChange={(e) => setCustomStartDateUI(e.target.value)}
                value={customStartDateUI}
              />
              <label>To</label>
              <input
                type="date"
                className="border-1 h-10 rounded-lg p-2"
                max={todayStr}
                onChange={(e) => setCustomEndDateUI(e.target.value)}
                value={customEndDateUI}
              />
              <br />
              <div className="flex justify-center w-full">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg 
                      hover:bg-indigo-700 transition-colors flex items-center 
                      cursor-pointer justify-center max-w-xs w-full"
                >
                  Set Range
                </button>
              </div>
            </form>
            <br />
          </>
        )}
        {noDataMessage && <p className="text-red-600">{noDataMessage}</p>}
      </div>
    </>
  );
}
