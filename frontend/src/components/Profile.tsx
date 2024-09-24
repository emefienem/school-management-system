import React, { useEffect, useState } from "react";
import AuthorizedComponent from "./AuthorizedComponent";
import { Link } from "react-router-dom";
import { useAuth } from "@/api/useAuth";

const Profile = () => {
  const { currentUser, currentRole, getFee, fee } = useAuth();

  const ID = currentUser?.user?.id;

  useEffect(() => {
    if (ID) getFee(ID);
  }, [ID]);

  const renderFee = () => {
    if (!fee || fee.length === 0) return <p>No fee structure available.</p>;

    return (
      <table className="min-w-full border border-gray-30">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">
              Duration (months)
            </th>
            <th className="border border-gray-300 px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {fee.map((feeItem, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-center">
                {feeItem.amount}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {feeItem.duration}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {new Date(feeItem.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2 className="uppercase">{currentRole} profile</h2>
      <p>{currentUser?.user?.name}</p>

      <AuthorizedComponent roles={["Admin"]}>
        <button className="bg-orange-500 text-white  px-4 py-2 rounded-lg">
          <Link to={"/admin/set-fee"}>{fee ? "Set Fee" : "Set New Fee"}</Link>
        </button>
        <div className="mt-10">{renderFee()}</div>
      </AuthorizedComponent>
    </div>
  );
};

export default Profile;
