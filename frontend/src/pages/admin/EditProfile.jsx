import { useState } from "react";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";

const EditProfile = () => {
  const { admin, setSession } = useAuth();
  const [details, setDetails] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    phone: admin?.phone || "",
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [detailsMsg, setDetailsMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const saveDetails = async (e) => {
    e.preventDefault();
    setDetailsMsg("");
    setSavingDetails(true);
    try {
      const { data } = await api.put("/auth/profile", details);
      setSession(data);
      setDetailsMsg("Details updated.");
    } catch (err) {
      setDetailsMsg(err.response?.data?.message || "Could not update details");
    } finally {
      setSavingDetails(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    if (passwords.newPassword !== passwords.confirm) {
      setPasswordMsg("New passwords don't match");
      return;
    }
    setSavingPassword(true);
    try {
      const { data } = await api.put("/auth/profile", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setSession(data);
      setPasswordMsg("Password updated.");
      setPasswords({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || "Could not update password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="font-display text-2xl">Account settings</h1>

      <form onSubmit={saveDetails} className="bg-white rounded-2xl border border-line/10 p-6 space-y-4">
        <h2 className="font-semibold">Your details</h2>
        {detailsMsg && <p className="text-sm text-crimson">{detailsMsg}</p>}
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            value={details.name}
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
            className="w-full border border-line/30 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            value={details.email}
            onChange={(e) => setDetails({ ...details, email: e.target.value })}
            className="w-full border border-line/30 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Phone</label>
          <input
            value={details.phone}
            onChange={(e) => setDetails({ ...details, phone: e.target.value })}
            placeholder="27677432782"
            className="w-full border border-line/30 rounded-lg px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={savingDetails}
          className="bg-ink text-paper px-5 py-2.5 rounded-full text-sm font-bold uppercase disabled:opacity-60"
        >
          {savingDetails ? "Saving…" : "Save details"}
        </button>
      </form>

      <form onSubmit={savePassword} className="bg-white rounded-2xl border border-line/10 p-6 space-y-4">
        <h2 className="font-semibold">Change password</h2>
        {passwordMsg && <p className="text-sm text-crimson">{passwordMsg}</p>}
        <div>
          <label className="block text-sm font-semibold mb-1">Current password</label>
          <input
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            required
            className="w-full border border-line/30 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">New password</label>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            required
            minLength={6}
            className="w-full border border-line/30 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Confirm new password</label>
          <input
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            required
            minLength={6}
            className="w-full border border-line/30 rounded-lg px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={savingPassword}
          className="bg-ink text-paper px-5 py-2.5 rounded-full text-sm font-bold uppercase disabled:opacity-60"
        >
          {savingPassword ? "Saving…" : "Change password"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
