const { BranchStatus, UserType } = require("shared/enums");
const User = require("../../models/user");

const generateBranchDummy = async () => {
  const getRandomDigitBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const users = await User.findAll({ where: { position: UserType.MANAGER } });
  return [
    {
      name: "Branch 1",
      address: {
        address1: "299 La Follette Pass",
        address2: "Apt 1626",
        city: "Jahāniān Shāh",
        postal: "40231",
        province: "Jahāniān",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      manager: users[getRandomDigitBetween(0, users.length - 1)].id,
      status: BranchStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Branch 2",
      address: {
        address1: "91683 Dorton Park",
        address2: "Room 1590",
        city: "Vakhtan",
        province: "Dorton",
        postal: "606900",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      manager: users[getRandomDigitBetween(0, users.length - 1)].id,
      status: BranchStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Branch 3",
      address: {
        address1: "4605 Trailsway Alley",
        address2: "Apt 1480",
        city: "Quipot",
        province: "Trailsway",
        postal: "4806",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      manager: users[getRandomDigitBetween(0, users.length - 1)].id,
      status: BranchStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

module.exports = { generateBranchDummy };
