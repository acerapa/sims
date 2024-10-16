const { BranchStatus } = require("shared/enums/transfer");
const bcryptJS = require("bcryptjs");

const generateBranchDummy = async () => {
  return [
    {
      name: "Branch 1",
      address: {
        address1: "299 La Follette Pass",
        address2: "Apt 1626",
        city: "Jahāniān Shāh",
        postal: "40231",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: BranchStatus.ACTIVE,
      manager: {
        username: "audrey",
        first_name: "Audrey",
        last_name: "Haitlie",
        password: await bcryptJS.hash("manager23", 10),
        middle_name: "",
        date_started: new Date(),
        position: "manager",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Branch 2",
      address: {
        address1: "91683 Dorton Park",
        address2: "Room 1590",
        city: "Vakhtan",
        postal: "606900",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: BranchStatus.ACTIVE,
      manager: {
        username: "miles",
        first_name: "Miles",
        last_name: "Camp",
        middle_name: "",
        password: await bcryptJS.hash("manager23", 10),
        date_started: new Date(),
        position: "manager",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Branch 3",
      address: {
        address1: "4605 Trailsway Alley",
        address2: "Apt 1480",
        city: "Quipot",
        postal: "4806",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: BranchStatus.ACTIVE,
      manager: {
        username: "mark",
        first_name: "Mark",
        last_name: "Clip",
        middle_name: "",
        password: await bcryptJS.hash("manager23", 10),
        date_started: new Date(),
        position: "manager",
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

module.exports = { generateBranchDummy };
