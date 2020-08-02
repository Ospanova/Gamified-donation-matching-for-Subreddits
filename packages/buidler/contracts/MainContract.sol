pragma solidity ^0.5.0;

import "@nomiclabs/buidler/console.sol";

contract MainContract {

  struct Donation {
    address from;
    uint amount;
  }

  struct Project {
    string title;
    string description;
    address sender;
  }

  address public owner;
  address public tokenAddress;

  Project[] projects;
  mapping (uint32 => uint) tokensDonated;
  mapping (uint32 => Donation[]) donations;

  constructor(address addr) public {
    owner = addr;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function setOwner(address addr) public onlyOwner {
    owner = addr;
  }

  function setTokenAddress(address addr) public onlyOwner {
    tokenAddress = addr;
  }

  function numberOfProjects() public view returns (uint) {
    return projects.length;
  }

  function getProjectInfoById(uint32 id) public view returns (string memory, string memory, address, uint) {
    require(id >= 0 && id < projects.length, "The project with given id doesnt exist");
    return (
      projects[id].title,
      projects[id].description,
      projects[id].sender,
      tokensDonated[id]
    );
  }

  function addProject(string calldata title, string calldata description) external {
    projects.push(Project(title, description, msg.sender));
  }

  function tokenFallback(address from, uint256 amount, bytes calldata data) external returns (bool) {
    require(msg.sender == tokenAddress, "tokenFallback should be called from expected token contract address");
    require(data.length == 4, "Data should be a 4 byte number (uint32)");

    uint32 projectId = 0;
    for (uint8 i = 0; i < 4; i++) {
        projectId += (uint32(uint8(data[3 - i])) << (8 * i));
    }

    require(projectId >= 0 && projectId < projects.length, "The project with given id doesnt exist");

    tokensDonated[projectId] += amount;
    donations[projectId].push(Donation(from, amount));

    return true;
  }
}
