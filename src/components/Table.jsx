import React from "react";

const TABLEHEADERS = [
  "Prescriber Type",
  "Severity",
  "Resolution Time",
  "Type of Error",
  "Location",
  "Created By",
  "Created Date",
  "",
];

const TableComponent = ({
  reports,
  handleDelete,
  totalCount,
  currentPage,
  setCurrentPage,
  pageCursors,
  setPageCursors,
}) => {
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);
  const noPages = totalPages === 0;

  const handleEdit = (report) => {
    document.getElementById("reports_modal").showModal();
    // If you want to lift report state, handleReport should be passed or accessed from context
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate displayed record numbers
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="h-400 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Showing {reports.length > 0 ? startRecord : 0} to{" "}
          {reports.length > 0 ? startRecord + reports.length - 1 : 0} of{" "}
          {totalCount} entries
        </div>
        <div className="text-sm text-gray-600">
          Page {totalCount > 0 ? currentPage : 0} of {totalPages}
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            {TABLEHEADERS.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report, idx) => (
              <tr key={idx}>
                <td>{report.prescriberType}</td>
                <td>{report.severity}</td>
                <td>{report.timeForResolution}</td>
                <td>{report.typeOfError}</td>
                <td>{report.location}</td>
                <td>
                  {report.username} - {report.email}
                </td>
                <td>
                  {typeof report.createdAt === "string"
                    ? report.createdAt
                    : report.createdAt.toDate().toLocaleString()}
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-outline btn-primary text-white btn-sm"
                      onClick={() => handleEdit(report)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error text-white btn-sm"
                      onClick={() => handleDelete(report.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={TABLEHEADERS.length}
                className="text-center py-8 text-gray-500"
              >
                No reports found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end items-center mt-4">
        <div className="flex gap-2">
          <button
            className="btn btn-outline"
            onClick={handlePreviousPage}
            disabled={noPages || currentPage === 1}
          >
            Previous
          </button>
          <button
            className="btn btn-outline"
            onClick={handleNextPage}
            disabled={noPages || currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
