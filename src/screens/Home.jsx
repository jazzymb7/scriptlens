import { useEffect, useState } from "react";
import ModalComponent from "../components/Modal";
import TableComponent from "../components/Table";
import { deleteData, getData, getUserReportCount } from "../firebase/utils";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const {
    logout,
    user,
    totalCount,
    setTotalCount,
    currentPage,
    setCurrentPage,
    pageCursors,
    setPageCursors,
    resetPagination,
  } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch reports when user or currentPage changes
  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user, currentPage]);

  const fetchReports = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const lastDoc = pageCursors[currentPage] || null;
      const data = await getData(user, 10, lastDoc);
      const count = await getUserReportCount(user);

      setTotalCount(count);
      setReports(data.reports);

      // Update next page cursor only if there are more results
      if (data.hasMore) {
        setPageCursors((prev) => ({
          ...prev,
          [currentPage + 1]: data.lastDoc,
        }));
      }
    } catch (error) {
      alert("Error fetching Reports");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteData(id);
      alert(result.message);

      // Update local state
      const updatedReports = reports.filter((item) => item.id !== id);
      setReports(updatedReports);
      setTotalCount(totalCount - 1);

      // If the current page becomes empty and it's not the first page, go back
      if (updatedReports.length === 0 && currentPage > 1) {
        resetPagination();
        fetchReports();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleModal = () => {
    document.getElementById("reports_modal").showModal();
  };

  const handleData = (data) => {
    // Reset to first page and refresh when a new report is added or edited
    resetPagination();
    fetchReports();
    setTotalCount(totalCount + 1);
  };

  return (
    <div className="mt-2 mr-10 ml-10 mb-10 p-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">ScriptLens</h1>
        <button className="btn btn-active btn-link" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div role="alert" className="alert alert-warning m-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>
          <strong>REMINDER: WE DO NOT</strong> include any doctor names, patient
          information, or personally identifiable information (PII) related to
          healthcare. Report only error patterns and categories.
        </span>
      </div>

      <div className="flex justify-between">
        <h1 className="text-4xl">Welcome {user?.displayName}</h1>
        <button
          className="btn bg-primaryBackground text-white hover:bg-hoverBackground"
          onClick={handleModal}
        >
          Add Report
        </button>
        <ModalComponent handleData={handleData} />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <TableComponent
            reports={reports}
            handleDelete={handleDelete}
            totalCount={totalCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageCursors={pageCursors}
            setPageCursors={setPageCursors}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
