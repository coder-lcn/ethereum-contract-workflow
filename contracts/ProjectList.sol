// SPDX-License-Identifier: MIT
import "./SafeMath.sol";
import "./Project.sol";

pragma solidity ^0.8.5;

contract ProjectList {
    using SafeMath for uint256;
    address[] public projects;
    address public CreatedProject;

    function createProject(
        string memory _description,
        uint256 _minInvest,
        uint256 _maxInvest,
        uint256 _goal
    ) public {
        address newProject = address(new Project(_description, _minInvest, _maxInvest, _goal, msg.sender));
        CreatedProject = newProject;
        projects.push(newProject);
    }

    function getProjects() public view returns (address[] memory) {
        return projects;
    }

    function getCreatedProject() public view returns (address) {
        return CreatedProject;
    }
}
