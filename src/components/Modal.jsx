import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { addData } from "../firebase/utils";
import { useAuth } from "../context/AuthContext";
import { serverTimestamp } from "firebase/firestore";

// New Zealand cities
const NZ_CITIES = [
  "Auckland",
  "Wellington",
  "Christchurch",
  "Hamilton",
  "Tauranga",
  "Napier-Hastings",
  "Dunedin",
  "Palmerston North",
  "Nelson",
  "Rotorua",
  "New Plymouth",
  "Whangarei",
  "Invercargill",
  "Whanganui",
  "Gisborne",
  "Timaru",
  "Masterton",
  "Ashburton",
  "Blenheim",
  "Oamaru",
  "Pukekohe",
  "Cambridge",
  "Rangiora",
  "Levin",
  "Tokoroa",
  "Matamata",
  "Thames",
  "Morrinsville",
  "Gore",
  "Whakatane",
].sort();

const PRESCRIBER_TYPES = [
  "Doctor",
  "Nurse",
  "Midwife",
  "Pharmacist",
  "Optometrist",
  "Other",
];

const ERROR_TYPES = [
  "Legal / Funding",
  "Incorrect Dosage",
  "Incorrect Strength",
  "Incorrect Drug",
  "Illegible",
];

const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"];

const RESOLUTION_TIMES = [
  "< 15 Minutes",
  "15 Minutes - 1 Hour",
  "> 1 Hour",
  "> 24 Hours",
  "Unresolved",
];

const ModalComponent = ({ handleData }) => {
  const { user, selectedReport, setSelectedReport } = useAuth();
  const [data, setData] = useState({
    prescriberType: "",
    typeOfError: "",
    severity: "",
    timeForResolution: "",
    location: "",
    id: uuidv4(),
  });

  useEffect(() => {
    if (selectedReport) {
      setData({
        prescriberType: selectedReport.prescriberType || "",
        typeOfError: selectedReport.typeOfError || "",
        severity: selectedReport.severity || "",
        timeForResolution: selectedReport.timeForResolution || "",
        location: selectedReport.location || "",
        id: selectedReport.id || uuidv4(),
      });
    }
  }, [selectedReport]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      data.prescriberType === "" ||
      data.typeOfError === "" ||
      data.severity === "" ||
      data.timeForResolution === "" ||
      data.location === ""
    ) {
      alert("Please fill in all fields");
      return;
    }

    let obj = {
      ...data,
      username: user.displayName,
      email: user.email,
      createdAt: serverTimestamp(),
    };
    try {
      const result = await addData(obj);
      if (result.status !== 200) {
        throw Error("Error updating document");
      }
      let localObj = {
        ...obj,
        createdAt: new Date().toLocaleString(),
      };
      handleData(localObj);
      setSelectedReport(null);
      setData({
        prescriberType: "",
        typeOfError: "",
        severity: "",
        timeForResolution: "",
        location: "",
        id: uuidv4(),
      });
      document.getElementById("reports_modal").close();
    } catch (error) {
      alert("Error updating Document, please try again");
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    handleData(null);
    document.getElementById("reports_modal").close();
  };

  return (
    <dialog id="reports_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h2 className="font-bold text-lg mb-3">Error Report</h2>
        <label className="input input-bordered flex items-center gap-2 mb-4">
          <span className="font-bold italic">Prescriber Type</span>
          <select
            className="grow"
            name="prescriberType"
            onChange={(e) => handleChange(e)}
            value={data.prescriberType}
          >
            <option value="">Select prescriber type...</option>
            {PRESCRIBER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="input input-bordered flex items-center gap-2 mb-4">
          <span className="font-bold italic">Type of Error</span>
          <select
            className="grow"
            name="typeOfError"
            onChange={(e) => handleChange(e)}
            value={data.typeOfError}
          >
            <option value="">Select error type...</option>
            {ERROR_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="input input-bordered flex items-center gap-2 mb-4">
          <span className="font-bold italic">Severity</span>
          <select
            className="grow"
            name="severity"
            onChange={(e) => handleChange(e)}
            value={data.severity}
          >
            <option value="">Select severity...</option>
            {SEVERITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <label className="input input-bordered flex items-center gap-2 mb-4">
          <span className="font-bold italic">Resolution Time</span>
          <select
            className="grow"
            name="timeForResolution"
            onChange={(e) => handleChange(e)}
            value={data.timeForResolution}
          >
            <option value="">Select resolution time...</option>
            {RESOLUTION_TIMES.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>

        <label className="input input-bordered flex items-center gap-2 mb-4">
          <span className="font-bold italic">Location (NZ)</span>
          <select
            className="grow"
            name="location"
            onChange={(e) => handleChange(e)}
            value={data.location}
          >
            <option value="">Select location...</option>
            {NZ_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <div className="flex flex-end gap-4">
              <button className="btn" onClick={handleClose}>
                Close
              </button>
              <button
                className="btn btn-success bg-primaryBackground text-white hover:bg-hoverBackground"
                onClick={handleSubmit}
              >
                {selectedReport ? "Edit Report" : "Add Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalComponent;
