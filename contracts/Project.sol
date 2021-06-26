// SPDX-License-Identifier: MIT
import "./SafeMath.sol";

pragma solidity ^0.8.5;

contract Project {
    using SafeMath for uint256;

    struct Payment {
        string description;
        uint256 amount;
        uint256 voterCount;
        address payable receiver;
        bool completed;
        string approve;
        string disApprove;
    }

    address public owner;
    string public description;
    uint256 public minInvest;
    uint256 public maxInvest;
    uint256 public goal;
    uint256 public investorCount;
    mapping(address => uint256) public investors;
    Payment[] public payments;

    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    constructor(
        string memory _description,
        uint256 _minInvest,
        uint256 _maxInvest,
        uint256 _goal,
        address _owner
    ) {
        owner = _owner;
        description = _description;
        minInvest = _minInvest;
        maxInvest = _maxInvest;
        goal = _goal;
    }

    function contribute() public payable {
        require(msg.value >= minInvest);
        require(msg.value <= maxInvest);

        uint256 newBalance = 0;
        newBalance = address(this).balance.add(msg.value);
        require(newBalance <= goal);

        if (investors[msg.sender] > 0) {
            investors[msg.sender] = investors[msg.sender] + msg.value;
        } else {
            investors[msg.sender] = msg.value;
            investorCount += 1;
        }
    }

    function createPayment(
        string memory _description,
        uint256 _amount,
        address payable _receiver
    ) public ownerOnly {
        uint256 paymentsCount = payments.length;
        payments.push();

        Payment storage newPayment = payments[paymentsCount];
        newPayment.description = _description;
        newPayment.amount = _amount;
        newPayment.receiver = _receiver;
        newPayment.completed = false;
        newPayment.voterCount = 0;
    }

    function approvePayment(uint256 index) public {
        Payment storage payment = payments[index];

        // must be investor to vote
        require(investors[msg.sender] > 0);

        // waiting to vote
        require(payment.completed == false);
        payment.completed = true;
        payment.voterCount += 1;
        payment.approve = append(payment.approve, "-", toString(msg.sender));
    }

    function disApprovePayment(uint256 index) public {
        Payment storage payment = payments[index];

        // must be investor to vote
        require(investors[msg.sender] > 0);

        // waiting to vote
        require(payment.completed == false);
        payment.completed = true;
        payment.disApprove = append(payment.disApprove, "-", toString(msg.sender));
    }

    function doPayment(uint256 index) public ownerOnly {
        Payment storage payment = payments[index];

        require(payment.completed);
        require(address(this).balance >= payment.amount);
        require(payment.voterCount > (investorCount / 2));

        payment.receiver.transfer(payment.amount);
        payment.completed = true;
    }

    function getSummary()
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (description, minInvest, maxInvest, goal, address(this).balance, investorCount, payments.length, owner);
    }

    function append(
        string memory a,
        string memory b,
        string memory c
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c));
    }

    function toString(address account) public pure returns (string memory) {
        return toString(abi.encodePacked(account));
    }

    function toString(uint256 value) public pure returns (string memory) {
        return toString(abi.encodePacked(value));
    }

    function toString(bytes32 value) public pure returns (string memory) {
        return toString(abi.encodePacked(value));
    }

    function toString(bytes memory data) public pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < data.length; i++) {
            str[2 + i * 2] = alphabet[uint256(uint8(data[i] >> 4))];
            str[3 + i * 2] = alphabet[uint256(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }
}
