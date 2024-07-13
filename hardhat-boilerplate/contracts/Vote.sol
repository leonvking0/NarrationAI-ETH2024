// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.17;


contract Vote {

    mapping(uint => uint) public votes;


    function like(uint uid) public {
        votes[uid]++;
    }

}