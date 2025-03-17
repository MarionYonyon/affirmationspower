import React from "react";

const Card = () => {
  return (
    <div className="bg-purple-light text-black p-6 rounded-xl shadow-light max-w-sm mx-auto mt-8">
      <h2 className="text-2xl font-sans font-semibold text-purple mb-4">
        Affirmation
      </h2>
      <p className="text-base font-sans text-black">
        "You are capable of achieving anything you set your mind to."
      </p>
      <div className="flex justify-between mt-6">
        <button className="bg-green text-white py-2 px-4 rounded-xl hover:bg-green-light transition">
          Accept
        </button>
        <button className="bg-white text-purple py-2 px-4 rounded-xl border-2 border-purple hover:bg-purple-light transition">
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default Card;
