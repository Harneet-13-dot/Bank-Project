import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
function RequestsList() {
  const [requests, setRequests] = useState([]);
// calling backend for get all pending requests
  const fetchRequests = async () => {
    try {
      const res = await API.get("/api/request/incoming");
      setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
    }
  };
// run once and fetches request
  useEffect(() => {
    fetchRequests();
  }, []);

  // accept
  const handleAccept = async (id) => {
    try {
      await API.post(`/api/request/${id}/accept`);
      toast.success("Request accepted ✅");
      fetchRequests(); // refresh
    } catch (err) {
      console.error(err);
      toast.error("Request rejected ❌");
      alert(err.response?.data?.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.post(`/api/request/${id}/reject`);
      fetchRequests(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Empty state
  if (!requests.length) {
    return (
      <div className="text-center p-6">
        📭 No pending requests
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold mb-4">Incoming Requests</h2>

      {requests.map((req) => (
        <div
          key={req._id}
          className="p-3 border rounded flex justify-between items-center"
        >
          <div>
            <p className="font-medium">
              {req.from?.name || "User"} requested ₹{req.amount}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleAccept(req._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => handleReject(req._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RequestsList;