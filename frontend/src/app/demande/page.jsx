"use client";
import iconCheck from "@/assets/check.png";
import iconclick from "@/assets/click.png";
import iconclose from "@/assets/close.png";
import Image from "next/image";
import { useState } from "react";
const cards = [
  {
    title: "En attente",
    desc: "Voir toutes les demandes",
    icon: iconclick,
  },
  {
    title: "Validées",
    desc: "Historique des demandes validées",
    icon: iconCheck,
  },
  {
    title: "Rejetées",
    desc: "Voir toutes les demandes rejetées",
    icon: iconclose,
  },
];

const Page = () => {
  const [showList, setShowList] = useState(false);
  const toggleList = () => {
    setShowList((state) => !state);
  };
  return (
    <div className="w-full flex flex-col items-center border-2">
      <h1 className="text-5xl self-start mt-15 ml-15 font-semibold text-blue-900">
        Demandes
      </h1>
      {showList && (
        <button
          className="self-start text-lg  ml-15 mt-5 font-bold text-gray-50 bg-blue-800 px-1.5 py-1 rounded-lg  cursor-pointer hover:opacity-65 transition-all duration-150"
          onClick={toggleList}
        >
          retour
        </button>
      )}

      <div className=" mt-15 self-center justify-self-center flex flex-row gap-5">
        {showList ? (
          <DemandeList items={null} />
        ) : (
          cards.map((item, idx) => (
            <Card key={idx} item={item} onClick={toggleList} />
          ))
        )}
      </div>
    </div>
  );
};

export default Page;

const Card = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="h-72  w-72 flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-110 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center mb-2">
        <Image
          src={item.icon}
          alt={item.text}
          width={24}
          height={24}
          className="w-[70px] h-[70px] mr-2"
        />
        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
      </div>
      <p className="text-sm text-gray-600">{item.desc}</p>
    </div>
  );
};
// type of demande liste : validee , rejet , en cours
//TODO: generic table for the tree types of demandes
const DemandeList = ({ items, type }) => {
  return <div>items</div>;
};
