//Settings.js

import React from "react";
import { JOBSTATUS_LABELS } from "../utils/constants";

const Settings = ({ jobStatus, setJobStatus }) => {
  const jobStatusOptions = Object.keys(JOBSTATUS_LABELS);

  return (
    <div>
      <h1>Settings</h1>
      <p>Select your job status:</p>
      {jobStatusOptions.map((status) => (
        <label key={status}>
          <input
            type="radio"
            value={status}
            checked={jobStatus === status}
            onChange={() => setJobStatus(status)}
          />
          {JOBSTATUS_LABELS[status]}
        </label>
      ))}
    </div>
  );
};

export default Settings;
