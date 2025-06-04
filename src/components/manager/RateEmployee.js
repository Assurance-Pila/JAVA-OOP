import React from 'react';
export default function RateEmployee() {
  return (
    <div className="container mt-4">
      <h2>Rate Employee</h2>
      <form>
        <div className="mb-3">
          <label>Employee Name</label>
          <input type="text" className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Performance Rating</label>
          <select className="form-select">
            <option>Excellent</option>
            <option>Good</option>
            <option>Average</option>
            <option>Poor</option>
          </select>
        </div>
        <button className="btn btn-success">Submit Rating</button>
      </form>
    </div>
  );
}
