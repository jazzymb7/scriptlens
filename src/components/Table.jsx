import React from "react";
import { useAuth } from "../context/AuthContext";

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

const TableComponent = ({ reports, handleDelete }) => {
  const { handleReport, totalCount, currentPage, setCurrentPage } = useAuth();
  const pageSize = 10;

  const totalPages = Math.ceil(totalCount / pageSize);
  const noPages = totalPages === 0;

  const handleEdit = (report) => {
    document.getElementById("reports_modal").showModal();
    handleReport(report);
  };

  return (
    <div className="h-400 overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {TABLEHEADERS.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 &&
            reports.map((report, eventIndex) => (
              <tr key={eventIndex}>
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
            ))}
        </tbody>
      </table>
      <div className="join justify-end mt-4 flex">
        <button
          className="join-item btn btn-outline mr-2"
          disabled={noPages || currentPage === 1}
        >
          Previous
        </button>
        <button
          className="join-item btn btn-outline"
          disabled={noPages || currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
